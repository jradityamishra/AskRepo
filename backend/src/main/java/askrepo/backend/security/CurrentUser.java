package askrepo.backend.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import askrepo.backend.exceptions.UnauthorizedException;

@Component
public class CurrentUser {
    public AppUserPrinciple require(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if(auth==null || !(auth.getPrincipal() instanceof AppUserPrinciple principle)){
            throw new UnauthorizedException("Not authenticated");
        }
        return principle;
    }
}
