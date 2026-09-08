package askrepo.backend.controller;

import askrepo.backend.dto.ChatMessageReponse;
import askrepo.backend.dto.ChatMessageRequest;
import askrepo.backend.dto.CreateChatSessionRequest;
import askrepo.backend.dto.ChatSessionResponse;
import askrepo.backend.security.CurrentUser;
import askrepo.backend.services.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {
    private final CurrentUser currentUser;
    private final ChatService chatService;

    @PostMapping("/sessions")
    public ResponseEntity<ChatSessionResponse> createSession(
            @Valid @RequestBody CreateChatSessionRequest request
    ){
        UUID userId=currentUser.require().getId();
        return ResponseEntity.ok(chatService.createSession(userId,request));
    }

    @GetMapping("/sessions")
    public List<ChatSessionResponse> listSessions(@RequestParam UUID repositoryId) {
       UUID userId=currentUser.require().getId();
       return chatService.listSession(userId,repositoryId);
    }

    @GetMapping("/sessions/{sessionId}/messages")
    public List<ChatMessageReponse> getMessages(@PathVariable UUID sessionId){
        UUID userId=currentUser.require().getId();
        return chatService.getMessage(userId,sessionId);
    }

    @PostMapping(value="/sessions/{sessionId}/messages",produces=MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter sendMessage(@PathVariable UUID sessionId,
        @Valid @RequestBody ChatMessageRequest request
    ){
        UUID userId=currentUser.require().getId();
        return chatService.streamReply(userId,sessionId,request.content());
    }
}
