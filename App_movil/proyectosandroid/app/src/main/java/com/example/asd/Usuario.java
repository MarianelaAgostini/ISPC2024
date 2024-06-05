package com.example.asd;

public class Usuario {
    private int id;
    private String Nombre;
    private String Apellido;
    private String Usuario;
    private String Password;

    public Usuario() {
        // Constructor vacío necesario para Firestore
    }

    public Usuario(String nombre, String apellido, String usuario, String password) {
        Nombre = nombre;
        Apellido = apellido;
        Usuario = usuario;
        Password = password;
    }

    public boolean isNull() {
        return Nombre.equals("") || Apellido.equals("") || Usuario.equals("");
    }

    @Override
    public String toString() {
        return "Usuario{" +
                "id=" + id +
                ", Nombre='" + Nombre + '\'' +
                ", Apellido='" + Apellido + '\'' +
                ", Usuario='" + Usuario + '\'' +
                ", Password='" + Password + '\'' +
                '}';
    }

    // Getters y setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNombre() {
        return Nombre;
    }

    public void setNombre(String nombre) {
        Nombre = nombre;
    }

    public String getApellido() {
        return Apellido;
    }

    public void setApellido(String apellido) {
        Apellido = apellido;
    }

    public String getUsuario() {
        return Usuario;
    }

    public void setUsuario(String usuario) {
        Usuario = usuario;
    }

    public String getPassword() {
        return Password;
    }

    public void setPassword(String password) {
        Password = password;
    }
}
