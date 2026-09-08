package askrepo.backend.services.ai;

import askrepo.backend.dto.CitationDto;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.filter.FilterExpressionBuilder;
import org.springframework.stereotype.Component;
import tools.jackson.core.JacksonException;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.json.JsonMapper;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CitationMapper {
  private static final String NO_MATCHES="(no matching code chunks found)";
  private static final JsonMapper JSON_MAPPER=JsonMapper.builder().build();

  private final VectorStore vectorStore;

  public RetrivedContext retrieve(UUID repositoryId,String question){
      var filter=new FilterExpressionBuilder()
              .eq(RagSettings.METADATA_REPO_ID,repositoryId.toString())
              .build();

      var search= SearchRequest.builder()
              .query(question)
              .topK(RagSettings.TOP_K_CHUNKS)
              .filterExpression(filter)
              .build();
      var documents=vectorStore.similaritySearch(search);

      var citation=documents.stream()
              .map(this::fromDocuments)
              .distinct()
              .toList();
      var contextText=documents.stream()
              .map(Document::getText)
              .collect(Collectors.joining("\n\n--\n\n"));
      if(contextText.isBlank()){
          contextText=NO_MATCHES;
      }
        return new RetrivedContext(citation,contextText);
  }

  private CitationDto fromDocuments(Document document){
      var metadata=document.getMetadata();
      String filePath=String.valueOf(metadata.get("filePath"));
      Integer startLine=metadata.get("startLine") instanceof Number n?n.intValue():null;
      Integer endLine=metadata.get("endLine") instanceof Number n?n.intValue():null;
      String language=metadata.get("language")!=null?String.valueOf(metadata.get("language")):null;
      return new CitationDto(filePath,startLine,endLine,language);
  }

  public String toJson(List<CitationDto> citations){
      if(citations==null || citations.isEmpty()){
          return null;
      }
      try{
          return JSON_MAPPER.writeValueAsString(citations);
      }catch (JacksonException ex){
          throw new IllegalStateException("Failed to serialize citations",ex);
      }
  }

  public List<CitationDto> fromJson(String json){
      if(json==null || json.isBlank()){
          return List.of();
      }
      try{
          return JSON_MAPPER.readValue(json,new TypeReference<List<CitationDto>>(){});
      }catch (JacksonException ex){
          throw new IllegalStateException("Failed to deserialize citations",ex);
      }
  }
}
