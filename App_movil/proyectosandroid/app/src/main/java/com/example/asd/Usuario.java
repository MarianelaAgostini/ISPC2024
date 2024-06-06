package com.example.asd;

public class Usuario {
    private int id;
    private String firstname;
    private String lastname;
    private String usuario;
    private String password;
    private String email;
    private int phone;

    public Usuario() {
        // Constructor vacío necesario para Firestore
    }

    public Usuario(String firstname, String lastname, String usuario, String password, String email, int phone) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.usuario = usuario;
        this.password = password;
        this.email = email;
        this.phone = phone;
    }

    public boolean isNull() {
        return (isNullOrEmpty(firstname) && isNullOrEmpty(lastname) && isNullOrEmpty(usuario) && isNullOrEmpty(password) && isNullOrEmpty(email) && phone == 0);
    }

    private boolean isNullOrEmpty(String str) {
        return str == null || str.isEmpty();
    }

    @Override
    public String toString() {
        return "Usuario{" +
                "id=" + id +
                ", firstname='" + firstname + '\'' +
                ", lastname='" + lastname + '\'' +
                ", usuario='" + usuario + '\'' +
                ", password='" + password + '\'' +
                ", email='" + email + '\'' +
                ", phone=" + phone +
                '}';
    }

    // Getters y setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public int getPhone() {
        return phone;
    }

    public void setPhone(int phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
