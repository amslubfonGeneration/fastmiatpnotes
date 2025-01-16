const passwordInput = document.getElementById('passwords');
const togglePassword = document.getElementById('togglePassword');

// Fonction pour basculer la visibilité du mot de passe
togglePassword.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.textContent = type === 'password' ? '👁️' : '👁️‍🗨️'; // Changer l'icône
});

// Effacer le champ de mot de passe à chaque fois qu'il est cliqué
passwordInput.addEventListener('focus', function () {
    this.value = ''; // Efface le contenu
});


document.getElementById("newPassword").addEventListener('click', function(event){
    const reponse1 = prompt(`Voulez vous modifier le mots pass de l'administration?`, "Oui ou Non")
    if(reponse1 !== "Oui"){
        event.preventDefault();
        alert('Mise a jours de mot de pass échouer')
    }
})



