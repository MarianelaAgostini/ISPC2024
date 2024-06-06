package com.example.asd;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;

import java.util.ArrayList;
import java.util.List;

public class EditarReceta extends AppCompatActivity {

    private RecyclerView recyclerView;
    private RecetaAdapter adapter;
    private List<Receta> listaRecetas;
    private FirebaseAuth mAuth;
    private FirebaseFirestore db;
    private boolean isAdmin = false;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_editar_receta);

        mAuth = FirebaseAuth.getInstance();
        db = FirebaseFirestore.getInstance();

        ActionBar actionBar = getSupportActionBar();
        assert actionBar != null;
        actionBar.setTitle("Editar Recetas");
        actionBar.setDisplayShowHomeEnabled(true);
        actionBar.setDisplayHomeAsUpEnabled(true);

        recyclerView = findViewById(R.id.recyclerViewRecetas);
        recyclerView.setHasFixedSize(true);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        listaRecetas = new ArrayList<>();

        FirebaseUser currentUser = mAuth.getCurrentUser();
        if (currentUser != null) {
            db.collection("users")
                    .document(currentUser.getUid())
                    .get()
                    .addOnCompleteListener(task -> {
                        if (task.isSuccessful()) {
                            DocumentSnapshot document = task.getResult();
                            if (document.exists()) {
                                // Verificar el rol del usuario
                                String rol = document.getString("rol");
                                if (rol != null && rol.equals("admin")) {
                                    isAdmin = true;
                                    obtenerRecetas();
                                } else {
                                    Toast.makeText(this, "Solo los administradores pueden acceder a esta función", Toast.LENGTH_SHORT).show();
                                    finish();
                                }
                            } else {
                                Toast.makeText(this, "El usuario no existe", Toast.LENGTH_SHORT).show();
                                finish();
                            }
                        } else {
                            Toast.makeText(this, "Error al obtener la información del usuario", Toast.LENGTH_SHORT).show();
                            finish();
                        }
                    });
        } else {
            Toast.makeText(this, "Usuario no autenticado", Toast.LENGTH_SHORT).show();
            finish();
        }
    }

    private void obtenerRecetas() {
        db.collection("recipes")
                .get()
                .addOnCompleteListener(task -> {
                    if (task.isSuccessful()) {
                        for (QueryDocumentSnapshot document : task.getResult()) {
                            String id = document.getId();
                            String nombre = document.getString("name");
                            String ingredientes = document.getString("ingredients");
                            String instrucciones = document.getString("description");
                            String categoria = document.getString("category");
                            String imagenURL = document.getString("imageURL");

                            // Obtener los valores de me gusta y no me gusta, asegurando que no sean null
                            Long likes = document.getLong("likes");
                            Long dislikes = document.getLong("dislikes");
                            int likesCount = (likes != null) ? likes.intValue() : 0;
                            int dislikesCount = (dislikes != null) ? dislikes.intValue() : 0;

                            Receta receta = new Receta(nombre, ingredientes, instrucciones, imagenURL, categoria);
                            receta.setId(id);
                            receta.setLikes(likesCount); // Set the likes count
                            receta.setDislikes(dislikesCount); // Set the dislikes count
                            listaRecetas.add(receta);
                        }
                        adapter = new RecetaAdapter(listaRecetas, EditarReceta.this, true);
                        recyclerView.setAdapter(adapter);
                    } else {
                        Toast.makeText(this, "Error al obtener las recetas", Toast.LENGTH_SHORT).show();
                    }
                });
    }

    private class RecetaAdapter extends RecyclerView.Adapter<RecetaAdapter.RecetaViewHolder> {

        private List<Receta> listaRecetas;
        private Context context;
        private boolean isClickable;

        public RecetaAdapter(List<Receta> listaRecetas, Context context, boolean isClickable) {
            this.listaRecetas = listaRecetas;
            this.context = context;
            this.isClickable = isClickable;
        }

        @NonNull
        @Override
        public RecetaViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_receta, parent, false);
            return new RecetaViewHolder(view);
        }

        @Override
        public void onBindViewHolder(@NonNull RecetaViewHolder holder, int position) {
            Receta receta = listaRecetas.get(position);
            holder.nombreTextView.setText(receta.getNombre());
            holder.ingredientesTextView.setText(receta.getIngredientes());
            holder.instruccionesTextView.setText(receta.getInstrucciones());

            // Convertir la categoría
            String categoria = receta.getIdCategoria();
            if ("opcion1".equals(categoria)) {
                categoria = "Cócteles con alcohol";
            } else if ("opcion2".equals(categoria)) {
                categoria = "Cócteles sin alcohol";
            }
            holder.categoriaTextView.setText(categoria);

            Glide.with(context).load(receta.getImagenURL()).into(holder.imagenImageView);

            if (isClickable) {
                holder.itemView.setOnClickListener(v -> {
                    Intent intent = new Intent(context, DetallesReceta.class);
                    intent.putExtra("receta", receta);
                    context.startActivity(intent);
                });
            }
        }

        @Override
        public int getItemCount() {
            return listaRecetas.size();
        }

        public class RecetaViewHolder extends RecyclerView.ViewHolder {
            TextView nombreTextView;
            TextView ingredientesTextView;
            TextView instruccionesTextView;
            TextView categoriaTextView;
            ImageView imagenImageView;

            public RecetaViewHolder(@NonNull View itemView) {
                super(itemView);
                nombreTextView = itemView.findViewById(R.id.name);
                ingredientesTextView = itemView.findViewById(R.id.itemIngredientesReceta);
                instruccionesTextView = itemView.findViewById(R.id.itemInstruccionesReceta);
                categoriaTextView = itemView.findViewById(R.id.itemCategorias);
                imagenImageView = itemView.findViewById(R.id.imageURL);
            }
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
