package com.example.asd;

import androidx.appcompat.app.AppCompatActivity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

public class Registrar extends AppCompatActivity implements View.OnClickListener {

    private EditText emailField, passwordField, firstNameField, lastNameField, phone;
    private Button registerButton, cancelButton;
    private FirebaseAuth mAuth;
    private FirebaseFirestore db;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.registrar);

        emailField = findViewById(R.id.RegUser);
        passwordField = findViewById(R.id.RegPass);
        firstNameField = findViewById(R.id.RegNombre);
        lastNameField = findViewById(R.id.RegApellido);
        phone = findViewById(R.id.RegPhone);
        registerButton = findViewById(R.id.btnRegRegistrar);
        cancelButton = findViewById(R.id.btnRegCancelar);

        registerButton.setOnClickListener(this);
        cancelButton.setOnClickListener(this);

        mAuth = FirebaseAuth.getInstance();
        db = FirebaseFirestore.getInstance();
    }

    @Override
    public void onClick(View view) {
        if (view.getId() == R.id.btnRegRegistrar) {
            registerUser();
        } else if (view.getId() == R.id.btnRegCancelar) {
            Intent intent = new Intent(Registrar.this, MainActivity.class);
            startActivity(intent);
            finish();
        }
    }

    private void registerUser() {
        String email = emailField.getText().toString().trim();
        String password = passwordField.getText().toString().trim();
        String firstName = firstNameField.getText().toString().trim();
        String lastName = lastNameField.getText().toString().trim();
        String phoneText = phone.getText().toString().trim();

        if (email.isEmpty() || password.isEmpty() || firstName.isEmpty() || lastName.isEmpty() || phoneText.isEmpty()) {
            Toast.makeText(this, "Error: campos vacíos", Toast.LENGTH_SHORT).show();
            return;
        }

        if (!isValidEmail(email)) {
            Toast.makeText(this, "Error: email no válido", Toast.LENGTH_SHORT).show();
            return;
        }

        if (!isValidPassword(password)) {
            Toast.makeText(this, "Error: contraseña no válida", Toast.LENGTH_SHORT).show();
            return;
        }

        int phoneNumber;
        try {
            phoneNumber = Integer.parseInt(phoneText);
        } catch (NumberFormatException e) {
            Toast.makeText(this, "Error: teléfono no válido", Toast.LENGTH_SHORT).show();
            return;
        }

        mAuth.createUserWithEmailAndPassword(email, password)
                .addOnCompleteListener(this, task -> {
                    if (task.isSuccessful()) {
                        FirebaseUser user = mAuth.getCurrentUser();
                        if (user != null) {
                            saveUserToFirestore(user.getUid(), email, firstName, lastName, password, phoneNumber);
                        }
                    } else {
                        Toast.makeText(Registrar.this, "Registro fallido: " + task.getException().getMessage(), Toast.LENGTH_SHORT).show();
                    }
                });
    }

    private boolean isValidEmail(String email) {
        String emailPattern = "^[\\w\\.-]+@([\\w\\-]+\\.)+[A-Z]{2,4}$";
        return Pattern.compile(emailPattern, Pattern.CASE_INSENSITIVE).matcher(email).matches();
    }

    private boolean isValidPassword(String password) {
        String passwordPattern = "^(?=.*[0-9])[A-Za-z0-9]{6,}$";
        return Pattern.compile(passwordPattern).matcher(password).matches();
    }

    private void saveUserToFirestore(String userId, String email, String firstName, String lastName, String password, int phone) {
        Map<String, Object> user = new HashMap<>();
        user.put("email", email);
        user.put("firstname", firstName);
        user.put("lastname", lastName);
        user.put("password", password);
        user.put("phone", phone);
        user.put("rol", "user");

        db.collection("users").document(userId).set(user)
                .addOnSuccessListener(aVoid -> {
                    Toast.makeText(Registrar.this, "Registro exitoso!!", Toast.LENGTH_SHORT).show();
                    Intent intent = new Intent(Registrar.this, MainActivity.class);
                    startActivity(intent);
                    finish();
                })
                .addOnFailureListener(e -> Toast.makeText(Registrar.this, "Error al registrar usuario en Firestore: " + e.getMessage(), Toast.LENGTH_SHORT).show());
    }
}
