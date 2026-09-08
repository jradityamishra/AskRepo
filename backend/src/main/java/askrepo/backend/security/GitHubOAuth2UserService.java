package askrepo.backend.security;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import askrepo.backend.entity.User;
import askrepo.backend.services.UserServices;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GitHubOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserServices userService;
    private final DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = delegate.loadUser(userRequest);

        String accessToken = userRequest.getAccessToken().getTokenValue();
        String scope = userRequest.getAccessToken().getScopes() != null
                ? String.join(",", userRequest.getAccessToken().getScopes())
                : "read:user,repo";

        User user = userService.upsertFromGithub(oauth2User.getAttributes(), accessToken, scope);
        return new AppUserPrinciple(user, oauth2User.getAttributes());
    }
}
