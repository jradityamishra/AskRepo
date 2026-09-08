package askrepo.backend.config;

import askrepo.backend.services.ai.RagSettings;
import io.qdrant.client.QdrantClient;
import io.qdrant.client.grpc.Collections.PayloadSchemaType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

/** Qdrant rejects filters on fields with no payload index, so ensure one exists for repoId on startup. */
@Component
@RequiredArgsConstructor
@Slf4j
public class QdrantIndexInitializer {
    private final QdrantClient qdrantClient;

    @Value("${spring.ai.vectorstore.qdrant.collection-name:vector_store}")
    private String collectionName;

    @EventListener(ApplicationReadyEvent.class)
    public void ensurePayloadIndexes() {
        try {
            qdrantClient
                    .createPayloadIndexAsync(
                            collectionName,
                            RagSettings.METADATA_REPO_ID,
                            PayloadSchemaType.Keyword,
                            null,
                            true,
                            null,
                            null)
                    .get();
            log.info("Ensured Qdrant payload index on '{}' for collection '{}'", RagSettings.METADATA_REPO_ID, collectionName);
        } catch (Exception e) {
            log.warn("Could not ensure Qdrant payload index on '{}': {}", RagSettings.METADATA_REPO_ID, e.getMessage());
        }
    }
}
