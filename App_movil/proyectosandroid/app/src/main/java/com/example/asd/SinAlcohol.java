package com.example.asd;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.os.Bundle;
import android.widget.Toast;

import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

import java.util.ArrayList;
import java.util.List;

public class SinAlcohol extends AppCompatActivity {

    RecyclerView recyclerViewSinAlcohol;
    RecetaAdapter adapter;
    FirebaseFirestore db;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sin_alcohol);

        ActionBar actionBar = getSupportActionBar();
        assert actionBar != null;
        actionBar.setTitle("Categoría Sin Alcohol");
        actionBar.setDisplayShowHomeEnabled(true);
        actionBar.setDisplayHomeAsUpEnabled(true);

        recyclerViewSinAlcohol = findViewById(R.id.recyclerViewSinAlcohol);
        recyclerViewSinAlcohol.setLayoutManager(new LinearLayoutManager(this));

        db = FirebaseFirestore.getInstance();

        obtenerRecetasSinAlcohol();
    }

    private void obtenerRecetasSinAlcohol() {
        db.collection("recipes")
                .whereEqualTo("category", "opcion2")
                .get()
                .addOnCompleteListener(task -> {
                    if (task.isSuccessful()) {
                        List<Receta> listaRecetasSinAlcohol = new ArrayList<>();
                        for (QueryDocumentSnapshot document : task.getResult()) {
                            Receta receta = document.toObject(Receta.class);
                            listaRecetasSinAlcohol.add(receta);
                        }
                        adapter = new RecetaAdapter(new ArrayList<>(listaRecetasSinAlcohol), this, false);
                        recyclerViewSinAlcohol.setAdapter(adapter);
                    } else {
                        Toast.makeText(SinAlcohol.this, "Error al obtener las recetas", Toast.LENGTH_SHORT).show();
                    }
                });
    }

    @Override
    public boolean onSupportNavigateUp() {
        onBackPressed();
        return super.onSupportNavigateUp();
    }
}
