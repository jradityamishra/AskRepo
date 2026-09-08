package askrepo.backend.security;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import askrepo.backend.entity.User;
import lombok.Getter;

@Getter
public class AppUserPrinciple implements OAuth2User {

    private final User user;
    private final Map<String, Object> attributes;
    public AppUserPrinciple(User user, Map<String, Object> attributes) {
        this.user = user;
        this.attributes = attributes;
    }
    public UUID getId(){
        return user.getId();
    }
    public User getuser(){
        return user;
    }


    @Override
    public Map<String,Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getName() {
        return String.valueOf(user.getGithubId());
    }

}
