package com.example.asd;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import com.google.firebase.firestore.FirebaseFirestore;

import java.util.HashMap;
import java.util.Map;

public class SubirRecetas extends AppCompatActivity {

    private EditText edtNombre, edtIngredientes, edtInstrucciones, edtImagenURL;
    private Button btnSubirRecetas;
    private Spinner spinnerCategoria;
    private FirebaseFirestore db;

    private final ActivityResultLauncher<Intent> galleryLauncher = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == AppCompatActivity.RESULT_OK) {
                    Intent data = result.getData();
                    if (data != null) {
                        Uri uri = data.getData();
                        edtImagenURL.setText(uri.toString());
                    }
                }
            }
    );

    private final Map<String, String> opcionesMap = new HashMap<>();

    @Override
    public boolean onSupportNavigateUp() {
        onBackPressed();
        return super.onSupportNavigateUp();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_subir_recetas);

        Toolbar toolbar = findViewById(R.id.toolbarB);
        setSupportActionBar(toolbar);

        ActionBar actionBar = getSupportActionBar();
        assert actionBar != null;
        actionBar.setTitle("Subir Recetas");
        actionBar.setDisplayShowHomeEnabled(true);
        actionBar.setDisplayHomeAsUpEnabled(true);

        db = FirebaseFirestore.getInstance();

        edtNombre = findViewById(R.id.NombreReceta);
        edtIngredientes = findViewById(R.id.Ingrediente);
        edtInstrucciones = findViewById(R.id.Descripcion);
        edtImagenURL = findViewById(R.id.ImagenURL);
        btnSubirRecetas = findViewById(R.id.SubirRecetas);
        spinnerCategoria = findViewById(R.id.spinnerCategoria);

        // Configurar el adaptador del spinner
        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(this,
                R.array.opciones_categoria, android.R.layout.simple_spinner_item);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinnerCategoria.setAdapter(adapter);

        // Llenar el mapa con las opciones y sus claves
        opcionesMap.put("Cócteles con alcohol", "opcion1");
        opcionesMap.put("Cócteles sin alcohol", "opcion2");

        btnSubirRecetas.setOnClickListener(v -> {
            String nombre = edtNombre.getText().toString();
            String ingredientes = edtIngredientes.getText().toString();
            String instrucciones = edtInstrucciones.getText().toString();
            String imagenURL = edtImagenURL.getText().toString();

            if (imagenURL.isEmpty()) {
                Toast.makeText(this, "Ingrese una URL válida", Toast.LENGTH_SHORT).show();
                return;
            }

            String categoria = spinnerCategoria.getSelectedItem().toString();
            String categoriaClave = opcionesMap.get(categoria); // Obtener la clave correspondiente

            agregarReceta(nombre, ingredientes, instrucciones, imagenURL, categoriaClave);

            limpiarCampos();
        });
    }

    private void limpiarCampos() {
        edtNombre.getText().clear();
        edtIngredientes.getText().clear();
        edtInstrucciones.getText().clear();
        edtImagenURL.getText().clear();
        spinnerCategoria.setSelection(0);
    }

    private void agregarReceta(String nombre, String ingredientes, String instrucciones, String imagenURL, String categoria) {
        if (nombre.isEmpty()) {
            Toast.makeText(this, "El nombre de la receta no puede estar vacío", Toast.LENGTH_SHORT).show();
            return;
        }

        try {
            Receta receta = new Receta(nombre, ingredientes, instrucciones, imagenURL, categoria);
            db.collection("recipes")
                    .add(receta)
                    .addOnSuccessListener(documentReference -> {
                        Toast.makeText(this, "La receta ha sido subida con éxito", Toast.LENGTH_SHORT).show();
                    })
                    .addOnFailureListener(e -> {
                        e.printStackTrace();
                        Toast.makeText(this, "Error al subir la receta", Toast.LENGTH_SHORT).show();
                    });
        } catch (Exception e) {
            e.printStackTrace();
            Toast.makeText(this, "Error al subir la receta", Toast.LENGTH_SHORT).show();
        }
    }
}
