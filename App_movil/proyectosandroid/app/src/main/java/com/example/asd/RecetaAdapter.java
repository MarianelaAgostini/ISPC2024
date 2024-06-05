package com.example.asd;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;

import java.util.ArrayList;
import java.util.HashMap;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.SetOptions;

public class RecetaAdapter extends RecyclerView.Adapter<RecetaAdapter.RecetaViewHolder> {

    private ArrayList<Receta> listaRecetas;
    private Context context;
    private boolean isClickable;

    public RecetaAdapter(ArrayList<Receta> listaRecetas, Context context, boolean isClickable) {
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
        holder.nombre.setText(receta.getNombre());
        holder.ingredientes.setText(receta.getIngredientes());
        holder.instrucciones.setText(receta.getInstrucciones());

        // Convertir la categoría
        String categoria = receta.getIdCategoria();
        if ("opcion1".equals(categoria)) {
            categoria = "Cócteles con alcohol";
        } else if ("opcion2".equals(categoria)) {
            categoria = "Cócteles sin alcohol";
        }
        holder.categoria.setText(categoria);

        Glide.with(context)
                .load(receta.getImagenURL())
                .into(holder.imagenReceta);

        // Cargar los contadores de likes y dislikes desde Firestore
        DocumentReference recipeRef = FirebaseFirestore.getInstance().collection("recipes").document(receta.getId());
        recipeRef.get().addOnSuccessListener(documentSnapshot -> {
            if (documentSnapshot.exists()) {
                Long likes = documentSnapshot.getLong("likes");
                Long dislikes = documentSnapshot.getLong("dislikes");

                // Verificar si los campos existen antes de asignarlos
                if (likes != null) {
                    receta.setLikes(likes.intValue());
                    holder.btnLike.setText("Me gusta (" + receta.getLikes() + ")");
                }

                if (dislikes != null) {
                    receta.setDislikes(dislikes.intValue());
                    holder.btnDislike.setText("No me gusta (" + receta.getDislikes() + ")");
                }
            }
        });


        if (isClickable) {
            holder.itemView.setOnClickListener(v -> {
                Intent intent = new Intent(context, DetallesReceta.class);
                intent.putExtra("receta", receta);
                context.startActivity(intent);
            });
        }

        holder.btnLike.setOnClickListener(v -> handleVote(receta, true, holder));
        holder.btnDislike.setOnClickListener(v -> handleVote(receta, false, holder));
    }

    @Override
    public int getItemCount() {
        return listaRecetas.size();
    }

    public void setRecetas(ArrayList<Receta> listaRecetas) {
        this.listaRecetas = listaRecetas;
        notifyDataSetChanged();
    }

    // Manejar votos
    private void handleVote(Receta receta, boolean isLike, RecetaViewHolder holder) {
        FirebaseFirestore db = FirebaseFirestore.getInstance();
        String userId = FirebaseAuth.getInstance().getCurrentUser().getUid();
        String recipeId = receta.getId();

        DocumentReference recipeRef = db.collection("recipes").document(recipeId);
        DocumentReference userVoteRef = db.collection("user_votes").document(userId + "_" + recipeId);

        userVoteRef.get().addOnSuccessListener(documentSnapshot -> {
            if (!documentSnapshot.exists()) {
                // El usuario no ha votado todavía
                userVoteRef.set(new HashMap<String, Object>() {{
                    put("recipeId", recipeId);
                    put("userId", userId);
                    put("vote", isLike ? "like" : "dislike");
                }});

                if (isLike) {
                    receta.setLikes(receta.getLikes() + 1);
                    holder.btnLike.setText("Me gusta (" + receta.getLikes() + ")");
                } else {
                    receta.setDislikes(receta.getDislikes() + 1);
                    holder.btnDislike.setText("No me gusta (" + receta.getDislikes() + ")");
                }
                recipeRef.set(receta, SetOptions.merge());
            } else {
                // El usuario ya ha votado
                Toast.makeText(context, "Ya has votado esta receta", Toast.LENGTH_SHORT).show();
            }
        });
    }

    public static class RecetaViewHolder extends RecyclerView.ViewHolder {
        TextView nombre, ingredientes, instrucciones, categoria;
        ImageView imagenReceta;
        Button btnLike, btnDislike;

        public RecetaViewHolder(@NonNull View itemView) {
            super(itemView);
            nombre = itemView.findViewById(R.id.name);
            ingredientes = itemView.findViewById(R.id.itemIngredientesReceta);
            instrucciones = itemView.findViewById(R.id.itemInstruccionesReceta);
            categoria = itemView.findViewById(R.id.itemCategorias);
            imagenReceta = itemView.findViewById(R.id.imageURL);
            btnLike = itemView.findViewById(R.id.btnLike);
            btnDislike = itemView.findViewById(R.id.btnDislike);
        }
    }
}