package com.example.asd;

import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.ListView;

import androidx.appcompat.app.AppCompatActivity;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

import java.util.ArrayList;

public class Mostrar extends AppCompatActivity {

    private ListView lista;
    private FirebaseFirestore db;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.mostrar);

        // Asignación de la lista desde el layout
        lista = findViewById(R.id.lista);

        // Inicialización de Firestore
        db = FirebaseFirestore.getInstance();

        // Obtención de la lista de usuarios desde Firestore
        obtenerUsuariosFirestore();
    }

    private void obtenerUsuariosFirestore() {
        db.collection("users")
                .get()
                .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                    @Override
                    public void onComplete(Task<QuerySnapshot> task) {
                        if (task.isSuccessful()) {
                            ArrayList<String> nombresCompletos = new ArrayList<>();
                            for (QueryDocumentSnapshot document : task.getResult()) {
                                String nombre = document.getString("firstname");
                                String apellido = document.getString("lastname");
                                nombresCompletos.add(nombre + " " + apellido);
                            }
                            mostrarListaUsuarios(nombresCompletos);
                        } else {
                            // Manejar errores
                        }
                    }
                });
    }

    private void mostrarListaUsuarios(ArrayList<String> nombresCompletos) {
        // Creación de un ArrayAdapter para mostrar la lista de nombres completos en el ListView
        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, nombresCompletos);

        // Asignación del adapter al ListView
        lista.setAdapter(adapter);
    }
}
