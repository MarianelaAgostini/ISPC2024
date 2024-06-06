package com.example.asd;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;

import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;

public class DetallesReceta extends AppCompatActivity {

    private static final String TAG = "DetallesReceta";

    EditText txtNombre, txtIngredientes, txtInstrucciones, txtImagen;
    Button btnActualizar, btnEliminar;

    private FirebaseFirestore db;
    private Spinner spinnerCategoria;
    private Receta receta;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_detalle_receta);

        // Configurar la barra de acción para mostrar el botón de "volver atrás"
        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
        }

        // Inicializar FirebaseFirestore
        db = FirebaseFirestore.getInstance();

        txtNombre = findViewById(R.id.txtNombre);
        txtIngredientes = findViewById(R.id.txtIngredientes);
        txtInstrucciones = findViewById(R.id.txtInstrucciones);
        txtImagen = findViewById(R.id.txtImagen);
        spinnerCategoria = findViewById(R.id.spinnerCategoria);
        btnActualizar = findViewById(R.id.btnActualizar);
        btnEliminar = findViewById(R.id.btnEliminar);

        // Configurar el adaptador del spinner
        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(this,
                R.array.opciones_categoria, android.R.layout.simple_spinner_item);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinnerCategoria.setAdapter(adapter);

        // Obtener la receta y mostrar los detalles
        receta = (Receta) getIntent().getSerializableExtra("receta");
        if (receta != null) {
            txtNombre.setText(receta.getNombre());
            txtIngredientes.setText(receta.getIngredientes());
            txtInstrucciones.setText(receta.getInstrucciones());
            txtImagen.setText(receta.getImagenURL());
            // Seleccionar la categoría de la receta en el Spinner
            String categoria = receta.getIdCategoria();
            int posicion = obtenerPosicionCategoria(categoria);
            spinnerCategoria.setSelection(posicion);
        }

        btnActualizar.setOnClickListener(v -> actualizarReceta());
        btnEliminar.setOnClickListener(v -> eliminarReceta());
    }

    private void actualizarReceta() {
        String nombre = txtNombre.getText().toString();
        String ingredientes = txtIngredientes.getText().toString();
        String instrucciones = txtInstrucciones.getText().toString();
        String categoria = spinnerCategoria.getSelectedItem().toString(); // Obtener la categoría seleccionada del Spinner
        String imagen = txtImagen.getText().toString();
        String categoriaFirestore = obtenerIdCategoria(categoria);

        // Añadir logs para depurar
        Log.d(TAG, "Nombre: " + nombre);
        Log.d(TAG, "Ingredientes: " + ingredientes);
        Log.d(TAG, "Instrucciones: " + instrucciones);
        Log.d(TAG, "Categoría (Spinner): " + categoria);
        Log.d(TAG, "Categoría (Firestore): " + categoriaFirestore);
        Log.d(TAG, "Imagen URL: " + imagen);

        // Obtener los valores actuales de "me gusta" y "no me gusta"
        db.collection("recipes").document(receta.getId()).get().addOnSuccessListener(documentSnapshot -> {
            if (documentSnapshot.exists()) {
                int meGusta = documentSnapshot.getLong("likes").intValue();
                int noMeGusta = documentSnapshot.getLong("dislikes").intValue();

                receta.setNombre(nombre);
                receta.setIngredientes(ingredientes);
                receta.setInstrucciones(instrucciones);
                receta.setIdCategoria(categoriaFirestore);
                receta.setImagenURL(imagen);
                receta.setLikes(meGusta);  // Preservar el valor de "me gusta"
                receta.setDislikes(noMeGusta);  // Preservar el valor de "no me gusta"

                db.collection("recipes").document(receta.getId())
                        .set(receta)
                        .addOnSuccessListener(aVoid -> {
                            Toast.makeText(this, "Receta actualizada con éxito", Toast.LENGTH_SHORT).show();
                            finish();
                        })
                        .addOnFailureListener(e -> {
                            Log.e(TAG, "Error al actualizar la receta", e);
                            Toast.makeText(this, "Error al actualizar la receta", Toast.LENGTH_SHORT).show();
                        });
            } else {
                Toast.makeText(this, "La receta no existe", Toast.LENGTH_SHORT).show();
            }
        }).addOnFailureListener(e -> {
            Log.e(TAG, "Error al obtener la receta", e);
            Toast.makeText(this, "Error al obtener la receta", Toast.LENGTH_SHORT).show();
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
                    Log.e(TAG, "Error al eliminar la receta", e);
                    Toast.makeText(this, "Error al eliminar la receta", Toast.LENGTH_SHORT).show();
                });
    }

    private int obtenerPosicionCategoria(String categoria) {
        if (categoria.equals("opcion1")) {
            return 0; // índice de "Cócteles con alcohol" en el spinner
        } else if (categoria.equals("opcion2")) {
            return 1; // índice de "Cócteles sin alcohol" en el spinner
        } else {
            return 0; // índice por defecto
        }
    }

    private String obtenerIdCategoria(String categoria) {
        if (categoria.equals(getString(R.string.CoctelCA))) {
            return "opcion1";
        } else if (categoria.equals(getString(R.string.ColctelSA))) {
            return "opcion2";
        } else {
            return ""; // valor por defecto
        }
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            onBackPressed();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
}
