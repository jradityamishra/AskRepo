package askrepo.backend.services;

import java.util.Map;
import java.util.UUID;



import org.springframework.security.crypto.encrypt.TextEncryptor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import askrepo.backend.entity.User;
import askrepo.backend.exceptions.NotFoundException;
import askrepo.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServices {
    private final UserRepository userRepository;
    private final TextEncryptor textEncryptor;

    @Transactional
    public User upsertFromGithub(Map<String, Object> attributes, String accessToken, String scope) {
       Long githubId=Long.valueOf(String.valueOf(attributes.get("id")));
        String login = String.valueOf(attributes.get("login"));

        Object rawName = attributes.get("name");
        String name = rawName != null ? String.valueOf(rawName) : login;

        Object rawAvatar = attributes.get("avatar_url");
        String avatarUrl = rawAvatar != null ? String.valueOf(rawAvatar) : null;

        String encryptedToken = textEncryptor.encrypt(accessToken);

        User user = userRepository.findByGithubId(githubId).orElseGet(User::new);
        user.setGithubId(githubId);
        user.setGithubUserName(login);
        user.setDisplayName(name);
        user.setAvatarUrl(avatarUrl);
        user.setAccessToken(encryptedToken);
        user.setTokenScope(scope);
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User getRequiredById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User " + id + " not found"));
    }

    public String decryptAccessToken(User user) {
        return textEncryptor.decrypt(user.getAccessToken());
    }
}
