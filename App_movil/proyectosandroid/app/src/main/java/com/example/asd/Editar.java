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
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;

public class Editar extends AppCompatActivity implements View.OnClickListener {

    private EditText ediUser, ediPass, ediNombre, ediApellido;
    private Button btnActualizar, btnCancelar;
    private String userId;
    private Usuario u;
    private FirebaseFirestore db;
    private DocumentReference userRef;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.editar);

        ediUser = findViewById(R.id.EdiUser);
        ediPass = findViewById(R.id.EdiPass);
        ediNombre = findViewById(R.id.EdiNombre);
        ediApellido = findViewById(R.id.EdiApellido);
        btnActualizar = findViewById(R.id.btnEdiActualizar);
        btnCancelar = findViewById(R.id.btnEdiCancelar);
        btnActualizar.setOnClickListener(this);
        btnCancelar.setOnClickListener(this);

        Bundle b = getIntent().getExtras();
        if (b != null) {
            userId = b.getString("userId");
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
                            ediUser.setText(u.getUsuario());
                            ediPass.setText(u.getPassword());
                            ediNombre.setText(u.getNombre());
                            ediApellido.setText(u.getApellido());
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
            u.setUsuario(ediUser.getText().toString());
            u.setPassword(ediPass.getText().toString());
            u.setNombre(ediNombre.getText().toString());
            u.setApellido(ediApellido.getText().toString());

            if (u.isNull()) {
                Toast.makeText(this, "Error: campos vacíos", Toast.LENGTH_SHORT).show();
            } else {
                actualizarUsuario();
            }
        } else if (v.getId() == R.id.btnEdiCancelar) {
            Intent i2 = new Intent(Editar.this, Inicio.class);
            startActivity(i2);
            finish();
        }
    }

    private void actualizarUsuario() {
        userRef.set(u).addOnCompleteListener(new OnCompleteListener<Void>() {
            @Override
            public void onComplete(@NonNull Task<Void> task) {
                if (task.isSuccessful()) {
                    Toast.makeText(Editar.this, "Actualización exitosa!!", Toast.LENGTH_SHORT).show();
                    Intent i2 = new Intent(Editar.this, MainActivity.class);
                    startActivity(i2);
                    finish();
                } else {
                    Toast.makeText(Editar.this, "No se puede actualizar!!", Toast.LENGTH_SHORT).show();
                }
            }
        });
    }
}
