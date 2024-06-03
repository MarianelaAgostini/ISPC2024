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
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.target.CustomTarget;
import com.bumptech.glide.request.transition.Transition;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;

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

        if (isClickable) {
            holder.itemView.setOnClickListener(v -> {
                Intent intent = new Intent(context, DetallesReceta.class);
                intent.putExtra("receta", receta);
                context.startActivity(intent);
            });
        }

        holder.btnDescargar.setOnClickListener(v -> {
            if (ContextCompat.checkSelfPermission(context, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions((Activity) context, new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, 1);
            } else {
                Log.d("RecetaAdapter", "Permiso concedido, descargando receta");
                holder.btnDescargar.setVisibility(View.GONE); // Ocultar el botón
                Bitmap recetaBitmap = getBitmapFromView(holder.itemView);
                holder.btnDescargar.setVisibility(View.VISIBLE); // Volver a mostrar el botón
                saveImageToGallery(recetaBitmap, receta.getNombre());
            }
        });
    }

    @Override
    public int getItemCount() {
        return listaRecetas.size();
    }

    public void setRecetas(ArrayList<Receta> listaRecetas) {
        this.listaRecetas = listaRecetas;
        notifyDataSetChanged();
    }

    // Método para capturar la vista como Bitmap
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

    public static class RecetaViewHolder extends RecyclerView.ViewHolder {
        TextView nombre, ingredientes, instrucciones, categoria;
        ImageView imagenReceta;
        Button btnDescargar;

        public RecetaViewHolder(@NonNull View itemView) {
            super(itemView);
            nombre = itemView.findViewById(R.id.name);
            ingredientes = itemView.findViewById(R.id.itemIngredientesReceta);
            instrucciones = itemView.findViewById(R.id.itemInstruccionesReceta);
            categoria = itemView.findViewById(R.id.itemCategorias);
            imagenReceta = itemView.findViewById(R.id.imageURL);
            btnDescargar = itemView.findViewById(R.id.btnDescargar);
        }
    }
}
