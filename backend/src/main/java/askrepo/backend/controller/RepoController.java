package askrepo.backend.controller;

import askrepo.backend.dto.IndexStatusResponse;
import askrepo.backend.dto.RepositoryResponse;
import askrepo.backend.entity.Repository;
import askrepo.backend.security.CurrentUser;
import askrepo.backend.services.RepoService;
import askrepo.backend.services.indexing.IndexingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/repos")
@RequiredArgsConstructor
public class RepoController {
    private final CurrentUser currentUser;
    private final RepoService repoService;
    private  final IndexingService indexingService;

    @GetMapping
    public List<RepositoryResponse> list(@RequestParam(name = "refresh",defaultValue = "true") boolean refresh){
        UUID userId=currentUser.require().getId();
        if(refresh){
            return repoService.syncAndListRepo(userId);
        }
        return repoService.listStored(userId);
    }

    @GetMapping("/{id}")
    public RepositoryResponse get(@PathVariable UUID id){
        UUID userId=currentUser.require().getId();
        return repoService.getRepo(id,userId);
    }

    @GetMapping("/{id}/status")
    public IndexStatusResponse status(@PathVariable UUID id){
        UUID userId =currentUser.require().getId();
        return repoService.status(id,userId);
    }

    @PostMapping("/{id}/index")
    public ResponseEntity<RepositoryResponse> index(@PathVariable UUID id){
        UUID userId=currentUser.require().getId();
        Repository repo=indexingService.startIndexing(id,userId);
        indexingService.indexAsync(id,userId);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(repoService.toResponseDto(repo));
    }

}
