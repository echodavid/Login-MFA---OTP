package auth.auth.repository;

import auth.auth.model.OtpCode;
import auth.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<OtpCode, Long> {

    // Find active (unused and not expired) OTP by user and code
    @Query("SELECT o FROM OtpCode o WHERE o.user = :user AND o.code = :code AND o.used = false AND o.expDate > :now")
    Optional<OtpCode> findActiveOtpByUserAndCode(@Param("user") User user, @Param("code") String code, @Param("now") LocalDateTime now);

    // Find all unused OTPs for a user (for cleanup)
    @Query("SELECT o FROM OtpCode o WHERE o.user = :user AND o.used = false")
    java.util.List<OtpCode> findUnusedOtpsByUser(@Param("user") User user);
}
