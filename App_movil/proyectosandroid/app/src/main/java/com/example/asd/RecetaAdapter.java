package com.example.asd;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.media.MediaScannerConnection;
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
import android.Manifest;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.SetOptions;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;

public class RecetaAdapter extends RecyclerView.Adapter<RecetaAdapter.RecetaViewHolder> {

    private ArrayList<Receta> listaRecetas;
    private Context context;
    private boolean isClickable;

    public RecetaAdapter(ArrayList<Receta> listaRecetas, Context context, boolean isClickable) {
        this.listaRecetas = listaRecetas != null ? listaRecetas : new ArrayList<>();
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
        holder.btnDescargar.setOnClickListener(v -> {
            if (ContextCompat.checkSelfPermission(context, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions((Activity) context, new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, 1);
            } else {
                Log.d("RecetaAdapter", "Permiso concedido, descargando receta");
                // Set buttons to invisible
                holder.btnLike.setVisibility(View.INVISIBLE);
                holder.btnDislike.setVisibility(View.INVISIBLE);
                holder.btnDescargar.setVisibility(View.INVISIBLE);

                Bitmap recetaBitmap = getBitmapFromView(holder.itemView);

                // Restore buttons' visibility
                holder.btnLike.setVisibility(View.VISIBLE);
                holder.btnDislike.setVisibility(View.VISIBLE);
                holder.btnDescargar.setVisibility(View.VISIBLE);

                saveImageToGallery(recetaBitmap, receta.getNombre());
            }
        });


        // Convertir la categoría
        String categoria = receta.getIdCategoria();
        if ("opcion1".equals(categoria)) {
            categoria = "Cócteles con alcohol";
            holder.btnLike.setVisibility(View.GONE);
            holder.btnDislike.setVisibility(View.GONE);
        } else if ("opcion2".equals(categoria)) {
            categoria = "Cócteles sin alcohol";
            holder.btnLike.setVisibility(View.GONE);
            holder.btnDislike.setVisibility(View.GONE);
        }
        holder.categoria.setText(categoria);

        Glide.with(context)
                .load(receta.getImagenURL())
                .into(holder.imagenReceta);

        // Verificar si el ID de la receta no es nulo antes de acceder a Firestore
        String recipeId = receta.getId();
        if (recipeId != null) {
            // Cargar los contadores de likes y dislikes desde Firestore
            DocumentReference recipeRef = FirebaseFirestore.getInstance().collection("recipes").document(recipeId);
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
            }).addOnFailureListener(e -> Log.e("RecetaAdapter", "Error al obtener datos de la receta", e));
        } else {
            Log.e("RecetaAdapter", "ID de receta nulo");
        }

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
    private Bitmap getBitmapFromView(View view) {
        Bitmap bitmap = Bitmap.createBitmap(view.getWidth(), view.getHeight(), Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);
        Drawable bgDrawable = view.getBackground();
        if (bgDrawable != null) {
            bgDrawable.draw(canvas);
        } else {
            canvas.drawColor(0xFFFFFFFF);
        }
        view.draw(canvas);
        return bitmap;
    }

    // Método para guardar el Bitmap en la galería
    private void saveImageToGallery(Bitmap bitmap, String imageName) {
        String savedImageURL = MediaStore.Images.Media.insertImage(
                context.getContentResolver(),
                bitmap,
                imageName,
                "Image of " + imageName
        );

        if (savedImageURL != null) {
            Uri savedImageURI = Uri.parse(savedImageURL);
            Toast.makeText(context, "Imagen guardada en la galería: " + savedImageURI, Toast.LENGTH_SHORT).show();
        } else {
            Toast.makeText(context, "Error guardando la imagen", Toast.LENGTH_SHORT).show();
        }
    }



    @Override
    public int getItemCount() {
        return listaRecetas.size();
    }

    public void setRecetas(ArrayList<Receta> listaRecetas) {
        this.listaRecetas = listaRecetas != null ? listaRecetas : new ArrayList<>();
        notifyDataSetChanged();
    }

    // Manejar votos
    private void handleVote(Receta receta, boolean isLike, RecetaViewHolder holder) {
        FirebaseFirestore db = FirebaseFirestore.getInstance();
        String userId = FirebaseAuth.getInstance().getCurrentUser().getUid();
        String recipeId = receta.getId();

        if (recipeId != null && userId != null) {
            DocumentReference recipeRef = db.collection("recipes").document(recipeId);
            DocumentReference userVoteRef = db.collection("user_votes").document(userId + "_" + recipeId);

            userVoteRef.get().addOnSuccessListener(documentSnapshot -> {
                if (documentSnapshot.exists()) {
                    String previousVote = documentSnapshot.getString("vote");

                    if (isLike && "dislike".equals(previousVote)) {
                        receta.setDislikes(receta.getDislikes() - 1);
                        receta.setLikes(receta.getLikes() + 1);
                        holder.btnDislike.setText("No me gusta (" + receta.getDislikes() + ")");
                        holder.btnLike.setText("Me gusta (" + receta.getLikes() + ")");
                        userVoteRef.update("vote", "like");
                    } else if (!isLike && "like".equals(previousVote)) {
                        receta.setLikes(receta.getLikes() - 1);
                        receta.setDislikes(receta.getDislikes() + 1);
                        holder.btnLike.setText("Me gusta (" + receta.getLikes() + ")");
                        holder.btnDislike.setText("No me gusta (" + receta.getDislikes() + ")");
                        userVoteRef.update("vote", "dislike");
                    } else if (isLike && "like".equals(previousVote)) {
                        receta.setLikes(receta.getLikes() - 1);
                        holder.btnLike.setText("Me gusta (" + receta.getLikes() + ")");
                        userVoteRef.delete();
                    } else if (!isLike && "dislike".equals(previousVote)) {
                        receta.setDislikes(receta.getDislikes() - 1);
                        holder.btnDislike.setText("No me gusta (" + receta.getDislikes() + ")");
                        userVoteRef.delete();
                    }
                } else {
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
                }

                // Actualizar los contadores de likes y dislikes en Firestore
                recipeRef.set(receta, SetOptions.merge());
            }).addOnFailureListener(e -> Log.e("RecetaAdapter", "Error al verificar voto del usuario", e));
        } else {
            Log.e("RecetaAdapter", "Recipe ID o User ID es nulo");
        }
    }

    public static class RecetaViewHolder extends RecyclerView.ViewHolder {
        TextView nombre, ingredientes, instrucciones, categoria;
        ImageView imagenReceta;
        Button btnDescargar;
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
            btnDescargar = itemView.findViewById(R.id.btnDescargar);
        }
    }
}
