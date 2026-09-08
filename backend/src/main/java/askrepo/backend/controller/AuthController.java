package askrepo.backend.controller;

import askrepo.backend.dto.UserResponse;
import askrepo.backend.entity.User;
import askrepo.backend.security.AppUserPrinciple;
import askrepo.backend.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final CurrentUser currentUser;
    @GetMapping("/login-url")
    public Map<String,String> loginUrl(){
        return Map.of("url","/oauth2/authorization/github");
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(){
        AppUserPrinciple principle=currentUser.require();
        User user=principle.getuser();
        return ResponseEntity.ok(new UserResponse(
                user.getId(),
                user.getGithubId(),
                user.getGithubUserName(),
                user.getDisplayName(),
                user.getAvatarUrl()));
    }
}
