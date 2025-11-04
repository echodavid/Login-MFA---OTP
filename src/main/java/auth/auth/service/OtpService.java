package auth.auth.service;

import auth.auth.model.OtpCode;
import auth.auth.model.User;
import auth.auth.repository.OtpRepository;
import auth.auth.repository.UserRepository;
import auth.auth.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private JwtUtil jwtUtil;

    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 5;

    public void generateAndSendOtp(String email, String machine) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate OTP
        String otp = generateOtp();

        // Set expiry
        LocalDateTime expDate = LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES);

        // Create OTP entity
        OtpCode otpCode = new OtpCode(user, otp, expDate, machine);
        otpRepository.save(otpCode);

        // Send email
        sendOtpEmail(email, otp);
    }

    public String verifyOtp(String email, String code, String machine) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDateTime now = LocalDateTime.now();
        OtpCode otpCode = otpRepository.findActiveOtpByUserAndCode(user, code, now)
                .orElseThrow(() -> new RuntimeException("Invalid or expired OTP"));

        // Mark as used
        otpCode.setUsed(true);
        otpRepository.save(otpCode);

        // Generate JWT token
        return jwtUtil.generateToken(email);
    }

    private String generateOtp() {
        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }

    private void sendOtpEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Your OTP Code");
        message.setText("Your OTP code is: " + otp + ". It expires in 5 minutes.");
        mailSender.send(message);
    }
}
