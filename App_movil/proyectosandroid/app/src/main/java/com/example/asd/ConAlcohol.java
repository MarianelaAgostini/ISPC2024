package com.example.asd;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

import java.util.ArrayList;
import java.util.List;

public class ConAlcohol extends AppCompatActivity {

    RecyclerView recyclerViewConAlcohol;
    RecetaAdapter adapter;
    FirebaseFirestore db;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_con_alcohol);

        ActionBar actionBar = getSupportActionBar();
        assert actionBar != null;
        actionBar.setTitle("Categoría Con Alcohol");
        actionBar.setDisplayShowHomeEnabled(true);
        actionBar.setDisplayHomeAsUpEnabled(true);

        recyclerViewConAlcohol = findViewById(R.id.recyclerViewConAlcohol);
        recyclerViewConAlcohol.setLayoutManager(new LinearLayoutManager(this));

        db = FirebaseFirestore.getInstance();

        obtenerRecetasConAlcohol();
    }

    private void obtenerRecetasConAlcohol() {
        db.collection("recipes")
                .whereEqualTo("category", "opcion1")
                .get()
                .addOnCompleteListener(task -> {
                    if (task.isSuccessful()) {
                        List<Receta> listaRecetasConAlcohol = new ArrayList<>();
                        for (QueryDocumentSnapshot document : task.getResult()) {
                            Receta receta = document.toObject(Receta.class);
                            listaRecetasConAlcohol.add(receta);
                        }
                        if (listaRecetasConAlcohol != null) {
                            adapter = new RecetaAdapter(new ArrayList<>(listaRecetasConAlcohol), this, false);
                            recyclerViewConAlcohol.setAdapter(adapter);
                        } else {
                            Log.e("Firestore", "Lista de recetas con alcohol es nula");
                        }
                    } else {
                        Toast.makeText(ConAlcohol.this, "Error al obtener las recetas", Toast.LENGTH_SHORT).show();
                    }
                });
    }


    @Override
    public boolean onSupportNavigateUp() {
        onBackPressed();
        return super.onSupportNavigateUp();
    }
}
