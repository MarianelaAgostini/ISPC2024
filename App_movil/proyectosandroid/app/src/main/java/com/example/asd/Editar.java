package com.example.asd;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import java.util.HashMap;
import java.util.Map;

public class Editar extends AppCompatActivity implements View.OnClickListener {

    private EditText ediPass, ediNombre, ediApellido, ediEmail, ediPhone;
    private Button btnActualizar, btnCancelar, btnEliminarUsuario;
    private String userId;
    private Usuario u;
    private FirebaseFirestore db;
    private DocumentReference userRef;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.editar);

        ediPass = findViewById(R.id.EdiPass);
        ediNombre = findViewById(R.id.EdiNombre);
        ediApellido = findViewById(R.id.EdiApellido);
        ediEmail = findViewById(R.id.EdiEmail);
        ediPhone = findViewById(R.id.EdiPhone);
        btnActualizar = findViewById(R.id.btnEdiActualizar);
        btnCancelar = findViewById(R.id.btnEdiCancelar);
        btnEliminarUsuario = findViewById(R.id.btnEliminarUsuario);
        btnActualizar.setOnClickListener(this);
        btnCancelar.setOnClickListener(this);
        btnEliminarUsuario.setOnClickListener(this);

        Bundle b = getIntent().getExtras();
        if (b != null) {
            userId = b.getString("id");
        }

        db = FirebaseFirestore.getInstance();
        userRef = db.collection("users").document(userId);

        cargarUsuario();
    }

    private void cargarUsuario() {
        userRef.get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
            @Override
            public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                if (task.isSuccessful()) {
                    DocumentSnapshot document = task.getResult();
                    if (document.exists()) {
                        u = document.toObject(Usuario.class);
                        if (u != null) {
                            ediPass.setText(u.getPassword());
                            ediNombre.setText(u.getFirstname());
                            ediApellido.setText(u.getLastname());
                            ediEmail.setText(u.getEmail());
                            ediPhone.setText(String.valueOf(u.getPhone()));
                        }
                    } else {
                        Toast.makeText(Editar.this, "Documento no existe", Toast.LENGTH_SHORT).show();
                    }
                } else {
                    Log.d("Firestore", "Error al obtener documento: ", task.getException());
                }
            }
        });
    }

    @Override
    public void onClick(View v) {
        if (v.getId() == R.id.btnEdiActualizar) {
            u.setPassword(ediPass.getText().toString());
            u.setFirstname(ediNombre.getText().toString());
            u.setLastname(ediApellido.getText().toString());
            u.setEmail(ediEmail.getText().toString());

            try {
                u.setPhone(Integer.parseInt(ediPhone.getText().toString()));
            } catch (NumberFormatException e) {
                Toast.makeText(this, "Número de teléfono no válido", Toast.LENGTH_SHORT).show();
                return;
            }

            if (u.isNull()) {
                Toast.makeText(this, "Error: campos vacíos", Toast.LENGTH_SHORT).show();
            } else {
                actualizarUsuario();
            }
        } else if (v.getId() == R.id.btnEdiCancelar) {
            Intent i2 = new Intent(Editar.this, menu.class);
            startActivity(i2);
            finish();
        } else if (v.getId() == R.id.btnEliminarUsuario) {
            eliminarUsuario();
        }
    }

    private void actualizarUsuario() {
        FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
        if (user != null) {
            user.updatePassword(u.getPassword()).addOnCompleteListener(new OnCompleteListener<Void>() {
                @Override
                public void onComplete(@NonNull Task<Void> task) {
                    if (task.isSuccessful()) {
                        userRef.get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
                            @Override
                            public void onComplete(@NonNull Task<DocumentSnapshot> task) {
                                if (task.isSuccessful()) {
                                    DocumentSnapshot document = task.getResult();
                                    if (document.exists()) {
                                        String rol = document.getString("rol");

                                        Map<String, Object> updatedUser = new HashMap<>();
                                        updatedUser.put("password", u.getPassword());
                                        updatedUser.put("firstname", u.getFirstname());
                                        updatedUser.put("lastname", u.getLastname());
                                        updatedUser.put("email", u.getEmail());
                                        updatedUser.put("phone", u.getPhone());
                                        updatedUser.put("rol", rol);

                                        userRef.set(updatedUser).addOnCompleteListener(new OnCompleteListener<Void>() {
                                            @Override
                                            public void onComplete(@NonNull Task<Void> task) {
                                                if (task.isSuccessful()) {
                                                    Toast.makeText(Editar.this, "Actualización exitosa!!", Toast.LENGTH_SHORT).show();
                                                    Intent i2 = new Intent(Editar.this, MainActivity.class); // Cambiado a MainActivity
                                                    startActivity(i2);
                                                    finish();
                                                } else {
                                                    Toast.makeText(Editar.this, "No se puede actualizar Firestore!!", Toast.LENGTH_SHORT).show();
                                                }
                                            }
                                        });
                                    } else {
                                        Toast.makeText(Editar.this, "Documento no existe", Toast.LENGTH_SHORT).show();
                                    }
                                } else {
                                    Log.d("Firestore", "Error al obtener documento: ", task.getException());
                                }
                            }
                        });
                    } else {
                        Toast.makeText(Editar.this, "No se puede actualizar la contraseña!!", Toast.LENGTH_SHORT).show();
                    }
                }
            });
        } else {
            Toast.makeText(Editar.this, "Usuario no autenticado", Toast.LENGTH_SHORT).show();
        }
    }

    private void eliminarUsuario() {
        FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
        if (user != null) {
            user.delete().addOnCompleteListener(new OnCompleteListener<Void>() {
                @Override
                public void onComplete(@NonNull Task<Void> task) {
                    if (task.isSuccessful()) {
                        userRef.delete().addOnCompleteListener(new OnCompleteListener<Void>() {
                            @Override
                            public void onComplete(@NonNull Task<Void> task) {
                                if (task.isSuccessful()) {
                                    Toast.makeText(Editar.this, "Usuario eliminado exitosamente", Toast.LENGTH_SHORT).show();
                                    Intent i = new Intent(Editar.this, MainActivity.class); // Cambiado a MainActivity
                                    startActivity(i);
                                    finish();
                                } else {
                                    Toast.makeText(Editar.this, "No se pudo eliminar el documento del usuario en Firestore", Toast.LENGTH_SHORT).show();
                                }
                            }
                        });
                    } else {
                        Toast.makeText(Editar.this, "No se pudo eliminar el usuario de Firebase Authentication", Toast.LENGTH_SHORT).show();
                    }
                }
            });
        } else {
            Toast.makeText(Editar.this, "Usuario no autenticado", Toast.LENGTH_SHORT).show();
        }
    }
}
