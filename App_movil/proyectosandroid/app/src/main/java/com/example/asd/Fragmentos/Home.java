package com.example.asd.Fragmentos;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.asd.R;
import com.example.asd.Receta;
import com.example.asd.RecetaAdapter;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

import java.util.ArrayList;

public class Home extends Fragment {

    private ArrayList<Receta> listaRecetas;
    private RecetaAdapter recetaAdapter;
    private FirebaseFirestore db;

    public Home() {
        // Required empty public constructor
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_home, container, false);
        listaRecetas = new ArrayList<>();
        initRecyclerView(view);
        return view;
    }

    private void initRecyclerView(View view) {
        RecyclerView recyclerView = view.findViewById(R.id.recyclerView);
        recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));

        if (listaRecetas != null) {
            recetaAdapter = new RecetaAdapter(listaRecetas, requireContext(), false); // false para no clicable
            recyclerView.setAdapter(recetaAdapter);
        } else {
            Log.e("Firestore", "Lista de recetas es nula");
        }

        db = FirebaseFirestore.getInstance();
        cargarRecetasDesdeFirestore();
    }

    private void cargarRecetasDesdeFirestore() {
        db.collection("recipes")
                .get()
                .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                    @Override
                    public void onComplete(@NonNull Task<QuerySnapshot> task) {
                        if (task.isSuccessful()) {
                            QuerySnapshot querySnapshot = task.getResult();
                            if (querySnapshot != null) {
                                for (QueryDocumentSnapshot document : querySnapshot) {
                                    String id = document.getId();
                                    String nombre = document.getString("name");
                                    String ingredientes = document.getString("ingredients");
                                    String instrucciones = document.getString("description");
                                    String categoria = document.getString("category");
                                    String imagenURL = document.getString("imageURL");

                                    if ("opcion1".equals(categoria)) {
                                        categoria = "Cócteles con alcohol";
                                    } else if ("opcion2".equals(categoria)) {
                                        categoria = "Cócteles sin alcohol";
                                    }

                                    Receta receta = new Receta(nombre, ingredientes, instrucciones, imagenURL, categoria);
                                    receta.setId(id);

                                    Log.d("Firestore", "Receta: " + receta.getNombre() + ", " +
                                            receta.getIngredientes() + ", " +
                                            receta.getInstrucciones() + ", " +
                                            receta.getImagenURL());

                                    listaRecetas.add(receta);
                                }
                                if (listaRecetas != null) {
                                    recetaAdapter.setRecetas(listaRecetas);
                                } else {
                                    Log.e("Firestore", "Lista de recetas es nula después de cargar datos");
                                }
                            } else {
                                Log.e("Firestore", "QuerySnapshot es nulo");
                            }
                        } else {
                            Log.e("Firestore", "Error obteniendo documentos: ", task.getException());
                        }
                    }
                });
    }
}
