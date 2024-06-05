package com.example.asd;

import com.google.firebase.firestore.PropertyName;

import java.io.Serializable;

    // Constructor con argumentos
    public class Receta implements Serializable {

        private String id;
        private String idCategoria;
        private String nombre;
        private String ingredientes;
        private String instrucciones;
        private String imagen;
        private int likes;
        private int dislikes;

        // Constructor sin argumentos necesario para Firestore
        public Receta() {
        }

        // Constructor con argumentos
        public Receta(String nombre, String ingredientes, String instrucciones, String imagenURL, String idCategoria) {
            this.nombre = nombre;
            this.ingredientes = ingredientes;
            this.instrucciones = instrucciones;
            this.imagen = imagenURL;
            this.idCategoria = idCategoria;
            this.likes = 0;
            this.dislikes = 0;
        }

        // Métodos getters y setters
        @PropertyName("idRecipes")
        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        @PropertyName("category")
        public String getIdCategoria() {
            return idCategoria;
        }

        @PropertyName("category")
        public void setIdCategoria(String idCategoria) {
            this.idCategoria = idCategoria;
        }

        @PropertyName("name")
        public String getNombre() {
            return nombre;
        }

        @PropertyName("name")
        public void setNombre(String nombre) {
            this.nombre = nombre;
        }

        @PropertyName("ingredients")
        public String getIngredientes() {
            return ingredientes;
        }

        @PropertyName("ingredients")
        public void setIngredientes(String ingredientes) {
            this.ingredientes = ingredientes;
        }

        @PropertyName("description")
        public String getInstrucciones() {
            return instrucciones;
        }

        @PropertyName("description")
        public void setInstrucciones(String instrucciones) {
            this.instrucciones = instrucciones;
        }

        @PropertyName("imageURL")
        public String getImagenURL() {
            return imagen;
        }

        @PropertyName("imageURL")
        public void setImagenURL(String imagenURL) {
            this.imagen = imagenURL;
        }

        @PropertyName("likes")
        public int getLikes() {
            return likes;
        }

        public void setLikes(int likes) {
            this.likes = likes;
        }

        @PropertyName("dislikes")
        public int getDislikes() {
            return dislikes;
        }

        public void setDislikes(int dislikes) {
            this.dislikes = dislikes;
        }
    }