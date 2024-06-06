package com.example.asd;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.example.asd.Fragmentos.Home;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;

public class Inicio extends AppCompatActivity implements View.OnClickListener {

    TextView nombre;
    Button btnEditar, btnEliminar, btnSalir;
    String userId;
    Usuario u;
    FirebaseFirestore db;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.inicio);

        nombre = findViewById(R.id.nombreUsuario);
        btnEditar = findViewById(R.id.btnEditar);
        btnEliminar = findViewById(R.id.btnEliminar);
        btnSalir = findViewById(R.id.btnSalir);
        btnEditar.setOnClickListener(this);
        btnEliminar.setOnClickListener(this);
        btnSalir.setOnClickListener(this);

        Bundle b = getIntent().getExtras();
        if (b != null) {
            userId = b.getString("id");
            db = FirebaseFirestore.getInstance();
            obtenerUsuarioDesdeFirestore();
        } else {
            Toast.makeText(this, "Error", Toast.LENGTH_SHORT).show();
        }
    }

    private void obtenerUsuarioDesdeFirestore() {
        db.collection("users").document(userId)
                .get()
                .addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
                    @Override
                    public void onSuccess(DocumentSnapshot documentSnapshot) {
                        if (documentSnapshot.exists()) {
                            u = documentSnapshot.toObject(Usuario.class);
                            nombre.setText(u.getFirstname() + " " + u.getLastname());
                        } else {
                            Toast.makeText(Inicio.this, "No se encontró el usuario", Toast.LENGTH_SHORT).show();
                        }
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        Toast.makeText(Inicio.this, "Error al obtener el usuario: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                    }
                });
    }

    @Override
    public void onClick(View v) {
        if (v.getId() == R.id.btnEditar) {
            Intent intent = new Intent(Inicio.this, Editar.class);
            intent.putExtra("id", userId);
            startActivity(intent);
        } else if (v.getId() == R.id.btnEliminar) {
            mostrarConfirmacionEliminarCuenta();
        } else if (v.getId() == R.id.btnSalir) {
            Intent intent = new Intent(Inicio.this, Home.class);
            startActivity(intent);
        }
    }

    private void mostrarConfirmacionEliminarCuenta() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setMessage("¿Estás seguro de eliminar tu cuenta?");
        builder.setCancelable(false);
        builder.setPositiveButton("Sí", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                eliminarCuenta();
            }
        });
        builder.setNegativeButton("No", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                dialogInterface.cancel();
            }
        });
        builder.show();
    }

    private void eliminarCuenta() {
        db.collection("users").document(userId)
                .delete()
                .addOnSuccessListener(new OnSuccessListener<Void>() {
                    @Override
                    public void onSuccess(Void aVoid) {
                        Toast.makeText(Inicio.this, "Cuenta eliminada correctamente", Toast.LENGTH_SHORT).show();
                        Intent intent = new Intent(Inicio.this, MainActivity.class);
                        startActivity(intent);
                        finish();
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        Toast.makeText(Inicio.this, "Error al eliminar la cuenta: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                    }
                });
    }
}
