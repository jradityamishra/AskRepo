package askrepo.backend.entity;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor //generates a no-argument constructor
@AllArgsConstructor //generates a constructor with all fields as parameters
@Table(name = "users") //table name in the database
@Builder   //generates a builder pattern for the class
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "github_id", nullable = false, unique = true)
    private Long githubId;

    @Column(name = "github_username", nullable = false, length = 100)
    private String githubUserName;

    @Column(name = "display_name", nullable = false, length = 100)
    private String displayName;

    private String email;

    @Column(name = "avatar_url", length = 255)
    private String avatarUrl;

    // Stored encrypted via TextEncryptor; TEXT because ciphertext can be long.
    @Column(name = "access_token", columnDefinition = "TEXT")
    private String accessToken;

    @Column(name = "token_scope", columnDefinition = "TEXT")
    private String tokenScope;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = Instant.now();
    }
}
