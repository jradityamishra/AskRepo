package askrepo.backend.dto;

import askrepo.backend.entity.MessageRole;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ChatMessageReponse (
        UUID id,
        MessageRole role,
        String content,
        List<CitationDto> citations,
        Instant createdAt
){}