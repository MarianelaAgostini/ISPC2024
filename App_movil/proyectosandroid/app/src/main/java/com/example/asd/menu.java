package com.example.asd;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;

import com.example.asd.Fragmentos.Categorias;
import com.example.asd.Fragmentos.Contacto;
import com.example.asd.Fragmentos.Home;
import com.example.asd.Fragmentos.PagWeb;
import com.example.asd.Fragmentos.Sobre_nosotros;
import com.google.android.material.navigation.NavigationView;

public class menu extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    DrawerLayout drawerLayout;
    private String userId;
    private String rol;
    private boolean isAdmin;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_menu);

        Toolbar toolbar = findViewById(R.id.toolbarA);
        setSupportActionBar(toolbar);

        drawerLayout = findViewById(R.id.drawer_layout_A);
        NavigationView navigationView = findViewById(R.id.nav_viewA);
        navigationView.setNavigationItemSelectedListener(this);

        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();

        // Recuperar el ID del usuario y el rol del usuario de SharedPreferences
        SharedPreferences sharedPreferences = getSharedPreferences("user_prefs", Context.MODE_PRIVATE);
        userId = sharedPreferences.getString("user_id", null);
        rol = sharedPreferences.getString("user_role", null);

        // Verificar si el usuario es administrador
        isAdmin = "admin".equals(rol);

        // Mostrar/ocultar el ícono de "Editar Recetas" basado en el rol del usuario
        Menu menu = navigationView.getMenu();
        MenuItem editarRecetaItem = menu.findItem(R.id.EditarReceta);
        editarRecetaItem.setVisible(isAdmin);
        if(savedInstanceState == null){
            getSupportFragmentManager().beginTransaction().replace(R.id.fragment_containerA, new Home()).commit();
            navigationView.setCheckedItem(R.id.Home);
        }
    }

    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem item) {

        int itemId = item.getItemId();

        if (itemId == R.id.Home) {
            getSupportFragmentManager().beginTransaction().replace(R.id.fragment_containerA, new Home()).commit();
        } else if (itemId == R.id.Categorias) {
            getSupportFragmentManager().beginTransaction().replace(R.id.fragment_containerA, new Categorias()).commit();
        } else if (itemId == R.id.Subir_Receta) {
            // Verificar si se ha establecido el ID del usuario
            if (userId != null) {
                Intent intent = new Intent(this, SubirRecetas.class);
                intent.putExtra("id", userId); // Aquí se pasa el ID del usuario al intent
                startActivity(intent);
            } else {
                // Manejar el caso en el que no se pudo obtener el ID del usuario
                Toast.makeText(this, "No se pudo obtener el ID del usuario.", Toast.LENGTH_SHORT).show();
            }
        } else if (itemId == R.id.Perfil) {
            // Verificar si se ha establecido el ID del usuario
            if (userId != null) {
                Intent intent = new Intent(this, Editar.class);
                intent.putExtra("id", userId);
                startActivity(intent);
            } else {
                // Manejar el caso en el que no se pudo obtener el ID del usuario
                Toast.makeText(this, "No se pudo obtener el ID del usuario.", Toast.LENGTH_SHORT).show();
            }
        } else if (itemId == R.id.EditarReceta) {
            // Verificar si el usuario es administrador
            if (isAdmin) {
                Intent intent = new Intent(this, EditarReceta.class);
                startActivity(intent);
            } else {
                Toast.makeText(this, "Solo los administradores pueden acceder a esta función", Toast.LENGTH_SHORT).show();
            }
        } else if (itemId == R.id.Sobre_nosotros) {
            getSupportFragmentManager().beginTransaction().replace(R.id.fragment_containerA, new Sobre_nosotros()).commit();
        } else if (itemId == R.id.Contacto) {
            getSupportFragmentManager().beginTransaction().replace(R.id.fragment_containerA, new Contacto()).commit();
        } else if (itemId == R.id.PagWeb) {
            getSupportFragmentManager().beginTransaction().replace(R.id.fragment_containerA, new PagWeb()).commit();
        } else if (itemId == R.id.Cerrar_sesion) {
            Toast.makeText(this, "Has cerrado sesión", Toast.LENGTH_SHORT).show();
            Intent intent = new Intent(this, MainActivity.class);
            startActivity(intent);

            finish();
        }

        drawerLayout.closeDrawer(GravityCompat.START);

        return true;
    }
}
