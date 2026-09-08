package askrepo.backend.dto;

import askrepo.backend.entity.IndexStatus;

import java.time.Instant;
import java.util.UUID;

public record IndexStatusResponse(
        UUID id,
        IndexStatus indexStatus,
        int filesProcessed,
        int filesTotal,
        int chunkCount,
        Instant indexedAt,
        String errorMessage
) {

}
