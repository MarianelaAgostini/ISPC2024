package com.example.asd;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.appcompat.widget.Toolbar;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;

import com.example.asd.Fragmentos.Categorias;
import com.example.asd.Fragmentos.Contacto;
import com.example.asd.Fragmentos.Home;
import com.example.asd.Fragmentos.PagWeb;
import com.example.asd.Fragmentos.Preguntas_frecuentes;
import com.example.asd.Fragmentos.Sobre_nosotros;
import com.google.android.material.navigation.NavigationView;

import java.util.Locale;

public class menu extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    DrawerLayout drawerLayout;
    private String userId;
    private String rol;
    private boolean isAdmin;
    private SharedPreferences sharedPreferences;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_menu);

        // Inicializa SharedPreferences
        sharedPreferences = getSharedPreferences("user_prefs", Context.MODE_PRIVATE);

        Toolbar toolbar = findViewById(R.id.toolbarA);
        setSupportActionBar(toolbar);

        drawerLayout = findViewById(R.id.drawer_layout_A);
        NavigationView navigationView = findViewById(R.id.nav_viewA);
        navigationView.setNavigationItemSelectedListener(this);

        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();

        // Recuperar el ID del usuario y el rol del usuario de SharedPreferences
        userId = sharedPreferences.getString("user_id", null);
        rol = sharedPreferences.getString("user_role", null);

        // Verificar si el usuario es administrador
        isAdmin = "admin".equals(rol);

        // Mostrar/ocultar el ícono de "Editar Recetas" basado en el rol del usuario
        Menu menu = navigationView.getMenu();
        MenuItem editarRecetaItem = menu.findItem(R.id.EditarReceta);
        if (editarRecetaItem != null) {
            editarRecetaItem.setVisible(isAdmin);
        }

        if (savedInstanceState == null) {
            getSupportFragmentManager().beginTransaction().replace(R.id.fragment_containerA, new Home()).commit();
            navigationView.setCheckedItem(R.id.Home);
        }

        // Configurar modo nocturno según las preferencias
        boolean nightMode = sharedPreferences.getBoolean("night_mode", false);
        AppCompatDelegate.setDefaultNightMode(nightMode ? AppCompatDelegate.MODE_NIGHT_YES : AppCompatDelegate.MODE_NIGHT_NO);
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
                Toast.makeText(this, getString(R.string.user_id_error), Toast.LENGTH_SHORT).show();
            }
        } else if (itemId == R.id.Perfil) {
            // Verificar si se ha establecido el ID del usuario
            if (userId != null) {
                Intent intent = new Intent(this, Editar.class);
                intent.putExtra("id", userId);
                startActivity(intent);
            } else {
                // Manejar el caso en el que no se pudo obtener el ID del usuario
                Toast.makeText(this, getString(R.string.user_id_error), Toast.LENGTH_SHORT).show();
            }
        } else if (itemId == R.id.EditarReceta) {
            if (isAdmin) {
                Intent intent = new Intent(this, EditarReceta.class);
                startActivity(intent);
            } else {
                Toast.makeText(this, "Solo los administradores pueden acceder a esta función", Toast.LENGTH_SHORT).show();
            }
        } else if (itemId == R.id.Sobre_nosotros) {
            getSupportFragmentManager().beginTransaction().replace(R.id.fragment_containerA, new Sobre_nosotros()).commit();
        } else if (itemId == R.id.Preguntas_frecuentes) {
            getSupportFragmentManager().beginTransaction().replace(R.id.fragment_containerA, new Preguntas_frecuentes()).commit();
        } else if (itemId == R.id.Contacto) {
            getSupportFragmentManager().beginTransaction().replace(R.id.fragment_containerA, new Contacto()).commit();
        } else if (itemId == R.id.PagWeb) {
            getSupportFragmentManager().beginTransaction().replace(R.id.fragment_containerA, new PagWeb()).commit();
        } else if (itemId == R.id.Cerrar_sesion) {
            Toast.makeText(this, "Has cerrado sesión", Toast.LENGTH_SHORT).show();
            Intent intent = new Intent(this, MainActivity.class);
            startActivity(intent);
            finish();
        } else if (itemId == R.id.nav_change_language) {
            showChangeLanguageDialog();
        } else if (itemId == R.id.nav_night_mode) {
            toggleNightMode();
        }

        drawerLayout.closeDrawer(GravityCompat.START);

        return true;
    }

    private void toggleNightMode() {
        boolean nightMode = sharedPreferences.getBoolean("night_mode", false);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        if (nightMode) {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
            editor.putBoolean("night_mode", false);
        } else {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
            editor.putBoolean("night_mode", true);
        }
        editor.apply();

        recreate();
    }


    private void showChangeLanguageDialog() {
        final String[] languages = {"Español", "English", "Русский"};
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle(getString(R.string.language_selection_title));
        builder.setSingleChoiceItems(languages, -1, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                switch (which) {
                    case 0:
                        setLocale("es");
                        break;
                    case 1:
                        setLocale("en");
                        break;
                    case 2:
                        setLocale("ru");
                        break;
                }
                dialog.dismiss();
            }
        });
        AlertDialog dialog = builder.create();
        dialog.show();
    }

    private void setLocale(String lang) {
        Locale locale = new Locale(lang);
        Locale.setDefault(locale);
        Resources resources = getResources();
        Configuration config = resources.getConfiguration();
        config.setLocale(locale);
        resources.updateConfiguration(config, resources.getDisplayMetrics());

        // Guardar la configuración del idioma en SharedPreferences
        SharedPreferences.Editor editor = getSharedPreferences("Settings", MODE_PRIVATE).edit();
        editor.putString("My_Lang", lang);
        editor.apply();

        // Recargar la actividad para aplicar el cambio de idioma
        Intent refresh = new Intent(this, menu.class);
        startActivity(refresh);
        finish();
    }

    // Cargar el idioma guardado en SharedPreferences
    public void loadLocale() {
        SharedPreferences prefs = getSharedPreferences("Settings", MODE_PRIVATE);
        String language = prefs.getString("My_Lang", "");
        setLocale(language);
    }
}