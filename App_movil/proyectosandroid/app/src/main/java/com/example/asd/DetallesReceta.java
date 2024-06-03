package com.example.asd;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.view.MenuItem;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;

import com.google.firebase.firestore.FirebaseFirestore;

public class DetallesReceta extends AppCompatActivity {

    EditText txtNombre, txtIngredientes, txtInstrucciones, txtCategoria, txtImagen;
    Button btnActualizar, btnEliminar;

    private FirebaseFirestore db;
    private Receta receta;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_detalle_receta);

        db = FirebaseFirestore.getInstance();

        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            actionBar.setTitle("Editar Receta");
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
        }

        txtNombre = findViewById(R.id.txtNombreReceta);
        txtIngredientes = findViewById(R.id.txtIngredientesReceta);
        txtInstrucciones = findViewById(R.id.txtInstruccionesReceta);
        txtCategoria = findViewById(R.id.txtCategoriasReceta);
        txtImagen = findViewById(R.id.txtImagenReceta);
        btnActualizar = findViewById(R.id.btnActualizarReceta);
        btnEliminar = findViewById(R.id.btnEliminarReceta);

        receta = (Receta) getIntent().getSerializableExtra("receta");
        if (receta != null) {
            txtNombre.setText(receta.getNombre());
            txtIngredientes.setText(receta.getIngredientes());
            txtInstrucciones.setText(receta.getInstrucciones());
            txtCategoria.setText(receta.getIdCategoria());
            txtImagen.setText(receta.getImagenURL());
        }

        btnActualizar.setOnClickListener(v -> actualizarReceta());
        btnEliminar.setOnClickListener(v -> eliminarReceta());
    }

    private void actualizarReceta() {
        String nombre = txtNombre.getText().toString();
        String ingredientes = txtIngredientes.getText().toString();
        String instrucciones = txtInstrucciones.getText().toString();
        String categoria = txtCategoria.getText().toString();
        String imagen = txtImagen.getText().toString();

        receta.setNombre(nombre);
        receta.setIngredientes(ingredientes);
        receta.setInstrucciones(instrucciones);
        receta.setIdCategoria(categoria);
        receta.setImagenURL(imagen);

        db.collection("recipes").document(receta.getId())
                .set(receta)
                .addOnSuccessListener(aVoid -> {
                    Toast.makeText(this, "Receta actualizada con éxito", Toast.LENGTH_SHORT).show();
                    finish();
                })
                .addOnFailureListener(e -> {
                    Toast.makeText(this, "Error al actualizar la receta", Toast.LENGTH_SHORT).show();
                });
    }

    private void eliminarReceta() {
        db.collection("recipes").document(receta.getId())
                .delete()
                .addOnSuccessListener(aVoid -> {
                    Toast.makeText(this, "Receta eliminada con éxito", Toast.LENGTH_SHORT).show();
                    finish();
                })
                .addOnFailureListener(e -> {
                    Toast.makeText(this, "Error al eliminar la receta", Toast.LENGTH_SHORT).show();
                });
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            onBackPressed();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
}
