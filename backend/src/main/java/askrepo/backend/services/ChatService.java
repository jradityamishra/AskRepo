package askrepo.backend.services;

import askrepo.backend.dto.ChatMessageReponse;
import askrepo.backend.dto.ChatSessionResponse;
import askrepo.backend.dto.CreateChatSessionRequest;
import askrepo.backend.entity.ChatMessage;
import askrepo.backend.entity.ChatSession;
import askrepo.backend.entity.IndexStatus;
import askrepo.backend.entity.MessageRole;
import askrepo.backend.entity.Repository;
import askrepo.backend.exceptions.BadRequestException;
import askrepo.backend.exceptions.NotFoundException;
import askrepo.backend.repository.ChatMessageRepository;
import askrepo.backend.repository.ChatSessionRepository;
import askrepo.backend.services.ai.ChatPromptBuilder;
import askrepo.backend.services.ai.ChatStreamHandler;
import askrepo.backend.services.ai.CitationMapper;
import askrepo.backend.services.ai.CodeContextRetrival;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final RepoService repoService;
    private final CodeContextRetrival codeContextRetrival;
    private final ChatPromptBuilder chatPromptBuilder;
    private final ChatStreamHandler chatStreamHandler;
    private final CitationMapper citationMapper;

    @Transactional
    public ChatSessionResponse createSession(UUID userId, CreateChatSessionRequest request){
        Repository repo=repoService.findByIdAndUserId(request.repositoryId(),userId);
        if(repo.getIndexStatus()!= IndexStatus.READY){
            throw new BadRequestException("Repository must be in indexed before chatting");
        }
        String title =request.title()!=null && !request.title().isBlank()
                ?request.title()
                :"Chat with "+repo.getFullName();

        ChatSession session=ChatSession.builder()
                .userId(userId)
                .repositoryId(repo.getId())
                .title(title)
                .build();

        session=chatSessionRepository.save(session);
        return toSessionResponse(session);

    }

    @Transactional
    public List<ChatSessionResponse> listSession(UUID userId,UUID repositoryId){
        repoService.findByIdAndUserId(repositoryId,userId);
        return chatSessionRepository
                .findByUserIdAndRepositoryIdOrderByCreatedAtDesc(userId,repositoryId)
                .stream()
                .map(this::toSessionResponse)
                .toList();

    }

    @Transactional
    public List<ChatMessageReponse> getMessage(UUID userId,UUID sessionId){
        ChatSession session =requireSession(userId,sessionId);
        return chatMessageRepository.findBySessionIdOrderByCreatedAtAsc(session.getId()).stream()
                .map(this::toMessageResponse)
                .toList();
    }

    @Transactional
    public ChatSession requireSession(UUID userId,UUID sessionId){
        return chatSessionRepository.findByIdAndUserId(sessionId,userId)
                .orElseThrow(()->new NotFoundException("chat session not found"));
    }

    public SseEmitter streamReply(UUID userId,UUID sessionId,String userContent){
        ChatSession session=requireSession(userId,sessionId);
        Repository repo=repoService.findByIdAndUserId(session.getRepositoryId(),userId);
        if(repo.getIndexStatus()!=IndexStatus.READY){
            throw new BadRequestException("Repository is not ready for chat");
        }

        ChatMessage userMessage=chatMessageRepository.save(ChatMessage.builder()
                .sessionId(session.getId())
                .role(MessageRole.USER)
                .content(userContent)
                .build());

        //rag retrival

        var retrievedContext=codeContextRetrival.retrieve(repo.getId(),userContent);

        //build LLM prompts from retrived context +question

        String systemPrompt=chatPromptBuilder.systemPrompt(repo.getFullName());
        String userPrompt=chatPromptBuilder.userPrompt(retrievedContext.contextText(),userContent);

        return chatStreamHandler.stream(
                sessionId,
                toMessageResponse(userMessage),
                retrievedContext.citations(),
                systemPrompt,
                userPrompt

        );


    }

    private ChatSessionResponse toSessionResponse(ChatSession session){
        return new ChatSessionResponse(
                session.getId(),
                session.getRepositoryId(),
                session.getTitle(),
                session.getCreatedAt()
        );
    }

    private ChatMessageReponse toMessageResponse(ChatMessage message){
        return new ChatMessageReponse(
                message.getId(),
                message.getRole(),
                message.getContent(),
                citationMapper.fromJson(message.getCitations()),
                message.getCreatedAt()
        );
    }

}
