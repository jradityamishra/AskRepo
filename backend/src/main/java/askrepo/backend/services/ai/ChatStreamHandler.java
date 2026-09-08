package askrepo.backend.services.ai;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

import java.util.UUID;

import org.springframework.ai.chat.client.ChatClient;

import askrepo.backend.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Component;

import askrepo.backend.dto.ChatMessageReponse;
import askrepo.backend.dto.CitationDto;
import askrepo.backend.entity.ChatMessage;
import askrepo.backend.entity.MessageRole;

@Component
@RequiredArgsConstructor
@Slf4j 
public class ChatStreamHandler {
    private final ChatModel chatModel;
    private final ChatMessageRepository chatMessageRepository;
    private final CitationMapper citationMapper;

    public SseEmitter stream(
        UUID sessionId,
        ChatMessageReponse savedUserMessage,
        List<CitationDto> citations,
        String systemPrompt,
        String userPrompt
    ) {
       SseEmitter emitter = new SseEmitter(RagSettings.STREAM_TIMEOUT_MS);
       StringBuilder fullyReply = new StringBuilder();

       try {
           emitter.send(SseEmitter.event().name("user_message").data(savedUserMessage));

           ChatClient.builder(chatModel)
           .build()
           .prompt()
           .system(systemPrompt)
           .user(userPrompt)
           .stream()
           .content()
           .doOnNext(token->appendToken(emitter,fullyReply,token))
           .doOnError(err->{
            log.error("Error occurred while streaming chat response", err);
            failStream(emitter, err);
           })
           .doOnComplete(()->completeStream(
            emitter,sessionId,fullyReply,
            citations
           ))
           .subscribe();
       } catch (Exception e) {
           log.error("Exception occurred while streaming chat response", e);
           failStream(emitter, e);
       }
       return emitter;
    }

    private void failStream(SseEmitter emitter, Throwable err) {
        try {
            emitter.send(SseEmitter.event().name("error").data("Failed to generate a response. Please try again.", MediaType.APPLICATION_JSON));
        } catch (Exception sendError) {
            log.warn("Could not send error event to client", sendError);
        } finally {
            emitter.complete();
        }
    }

    private void appendToken(SseEmitter emitter, StringBuilder fullyReply, String token) {
        fullyReply.append(token);
        try {
            emitter.send(SseEmitter.event().name("token").data(token,MediaType.APPLICATION_JSON));

        } catch (Exception e) { 
           throw new IllegalStateException(e);
           
        }
    }
    private void completeStream(SseEmitter emitter, UUID sessionId, StringBuilder fullyReply, List<CitationDto> citations) {
      try{
          ChatMessage assistant=chatMessageRepository.save(
            ChatMessage.builder()
            .sessionId(sessionId)
            .role(MessageRole.ASSISTANT)
            .content(fullyReply.toString())
            .citations(citationMapper.toJson(citations))
            .build()
        );
        emitter.send(SseEmitter.event().name("assistant_message").data(toMessageDto(assistant)));
        emitter.send(SseEmitter.event().name("done").data("[DONE]"));
        emitter.complete();
      } catch (Exception e) {
          log.error("Exception occurred while completing chat stream", e);
          emitter.completeWithError(e);
      }
    }

    private ChatMessageReponse toMessageDto(ChatMessage chatMessage) {
        return new ChatMessageReponse(
            chatMessage.getId(),
            chatMessage.getRole(),
            chatMessage.getContent(),
            citationMapper.fromJson(chatMessage.getCitations()),
            chatMessage.getCreatedAt()
        );
    }
}
