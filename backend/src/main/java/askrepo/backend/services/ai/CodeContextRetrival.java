package askrepo.backend.services.ai;

import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.filter.FilterExpressionBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CodeContextRetrival{
    private static final String NO_MATCHES="(no matching code chunks found)";

    private final VectorStore vectorStore;
    private final CitationMapper citationMapper;

    public RetrivedContext retrieve(UUID repositoryId,String question){
        return citationMapper.retrieve(repositoryId,question);
    }

}
