package askrepo.backend.services.ai;

import askrepo.backend.dto.CitationDto;

import java.util.List;

public record RetrivedContext (
        List<CitationDto> citations,
        String contextText
)
{}
