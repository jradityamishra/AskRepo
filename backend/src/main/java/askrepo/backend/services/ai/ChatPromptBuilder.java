package askrepo.backend.services.ai;

import org.springframework.stereotype.Component;

@Component
public class ChatPromptBuilder {

    public String systemPrompt(String repositoryFullName){
        return """
                You are AskRepo, an expert assistant for the %s codebase.
                Answer using ONLY the provided code context.
                If the context is insufficient ,say you are unsure.
                Cite file paths and line ranges when relevant.
                Be concise and techincal
                """.formatted(repositoryFullName);
    }

    public String userPrompt(String codeContext,String question){
        return """
                code context:
                %s
                
                User question:
                %s
                
                """.formatted(codeContext,question);
    }
}
