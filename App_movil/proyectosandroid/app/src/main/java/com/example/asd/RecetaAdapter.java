package com.example.asd;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.asd.R;

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

        // Usar Glide para cargar la imagen
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
    }

    @Override
    public int getItemCount() {
        return listaRecetas.size();
    }

    public void setRecetas(ArrayList<Receta> listaRecetas) {
        this.listaRecetas = listaRecetas;
        notifyDataSetChanged();
    }

    public static class RecetaViewHolder extends RecyclerView.ViewHolder {
        TextView nombre, ingredientes, instrucciones;
        ImageView imagenReceta;

        public RecetaViewHolder(@NonNull View itemView) {
            super(itemView);
            nombre = itemView.findViewById(R.id.name);
            ingredientes = itemView.findViewById(R.id.itemIngredientesReceta);
            instrucciones = itemView.findViewById(R.id.itemInstruccionesReceta);
            imagenReceta = itemView.findViewById(R.id.imageURL); // Asegúrate de que este ID coincida con el ID en item_receta.xml
        }
    }
}
