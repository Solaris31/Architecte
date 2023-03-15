const siteGlobal = document.querySelector('body');
const parentDesBoutons = document.querySelector('.conteneurBoutonFiltre');
const zonePrincipale = document.getElementById('zonePrincipaleMain');

let projetsFiltres = [];



function vidangeGalerie() {
    const parentDeLaGalerie = document.querySelector('div.gallery');
    parentDeLaGalerie.innerHTML = "";
};


function creeGalerie(categorie=0) {
    const url = 'http://localhost:5678/api/works';
    fetch(url).then((reponse) => reponse.json()).then (function (data) {

        projetsFiltres = data.filter(function (projetsAFiltrer) {
            if (categorie === 0) {
                return true;
            } else {
                return projetsAFiltrer.categoryId === categorie;
            }
        });
    return projetsFiltres;
    });
return projetsFiltres;
};


function afficheGalerie() {
    const parentDeLaGalerie = document.querySelector('div.gallery');
    parentDeLaGalerie.innerHTML='';
    for (projets of projetsFiltres) {
        const projet = document.createElement('figure');
        projet.innerHTML = `<img src="${projets.imageUrl}" crossorigin="anonymous" alt="${projets.title}">
        <figcaption>${projets.title}</figcaption>`;
        parentDeLaGalerie.appendChild(projet);

    }
};


vidangeGalerie();
projetsFiltres = creeGalerie();
afficheGalerie();



// Creation du bouton "Tous" + event listener sur ce bouton //////////////////////////////////////////////////////////////////////////////
const nomBouton = document.createElement('button');
nomBouton.setAttribute("id","btn0");
nomBouton.innerHTML = `<input type="radio" name="bouton" id="boutonFiltreObjets0" checked><label for="boutonFiltreObjets0" class="filtres bouton0">Tous</label>`;
parentDesBoutons.appendChild(nomBouton);

nomBouton.addEventListener('click', () => {
    vidangeGalerie();
    creeGalerie();
    afficheGalerie();
});



// Creation des boutons "Objets", "Appartements", "Hotels et restaurants" + event listener sur ces 3 boutons /////////////////////////////
let url = 'http://localhost:5678/api/categories';
fetch(url).then((reponse) => reponse.json()).then(function (data) {
    for (valeursDeData of data) {
        const nomBouton = document.createElement('button');

        nomBouton.setAttribute("id",`btn${valeursDeData.id}`);
        nomBouton.innerHTML =
        `<input type="radio" name="bouton" id="boutonFiltreObjets${valeursDeData.id}">
        <label for="boutonFiltreObjets${valeursDeData.id}" class="filtres bouton${valeursDeData.id}">${valeursDeData.name}</label>`;
        parentDesBoutons.appendChild(nomBouton);


        document.getElementById("boutonFiltreObjets" + valeursDeData.id).addEventListener('click', () => {
            vidangeGalerie();
            if      (boutonFiltreObjets1.checked) { projetsFiltres = creeGalerie(1) ; afficheGalerie(); console.log(projetsFiltres);}
            else if (boutonFiltreObjets2.checked) { projetsFiltres = creeGalerie(2) ; afficheGalerie(); console.log(projetsFiltres);}
            else if (boutonFiltreObjets3.checked) { projetsFiltres = creeGalerie(3) ; afficheGalerie(); console.log(projetsFiltres);}
        });
    };
});

// Creation formulaire de login de larchitecte ////////////////////////////
// ////////////////////////////////////////////////////////////////////////
// Declenchement du formulaire de login de larchitecte au click de "login"
document.getElementById("login").addEventListener("click", () => {

    // Modification du style du lien "login"
    const lienLogin = document.getElementById('login');
    lienLogin.setAttribute('class', 'nouveauStyleLogin');

    // Creation dune nouvelle zone de saisie
    zonePrincipale.setAttribute('id', 'nouvelleZonePrincipale');
    zonePrincipale.innerHTML = "";

    // Creation dune balise H2
    const titreLogin = document.createElement('h2');
    titreLogin.setAttribute('id', 'titreLoginH2');

    // Reconstitution de la balise label Email
    const labelEmail = document.createElement('label');
    labelEmail.setAttribute('for', 'email');
    labelEmail.setAttribute('id', 'texteEmailLogIn');

    // Reconstitution de la balise input Email
    const inputEmail = document.createElement('input');
    inputEmail.setAttribute('type', 'email');
    inputEmail.setAttribute('id', 'inputMail');

    // Reconstitution de la balise label mot de passe
    const labelMotDePasse = document.createElement('label');
    labelMotDePasse.setAttribute('for', 'password');
    labelMotDePasse.setAttribute('id', 'texteMotDePasseLogIn');

    // Reconstitution de la balise input Mot de passe
    const inputMotDePasse = document.createElement('input');
    inputMotDePasse.setAttribute('type', 'password');
    inputMotDePasse.setAttribute('id', 'inputMotDePasseLogIn');
    titreLogin.innerHTML = `Log In</h2>`;
    labelEmail.innerHTML = `E-mail</label>`;
    inputEmail.innerHTML = `</input>`;
    labelMotDePasse.innerHTML = `Mot de passe</label>`;
    inputMotDePasse.innerHTML = `</input>`;


    // Reconstitution du bouton pour se connecter
    const boutonSeConnecter = document.createElement('input');
    boutonSeConnecter.setAttribute('type', 'button');
    boutonSeConnecter.setAttribute('id', 'boutonSeConnecterLogIn');
    boutonSeConnecter.setAttribute('value', 'Se connecter');
    boutonSeConnecter.innerHTML = `</input>`;

    // Reconstitution du lien pour recuperer son mot de passe
    const motDePasseOublie = document.createElement('a');
    motDePasseOublie.setAttribute('href', '#');
    motDePasseOublie.setAttribute('id', 'motDePasseOublie');
    motDePasseOublie.innerHTML = `Mot de passe oublié</a>`


    nouvelleZonePrincipale.appendChild(titreLogin);
    nouvelleZonePrincipale.appendChild(labelEmail);
    nouvelleZonePrincipale.appendChild(inputEmail);
    nouvelleZonePrincipale.appendChild(labelMotDePasse);
    nouvelleZonePrincipale.appendChild(inputMotDePasse);
    nouvelleZonePrincipale.appendChild(boutonSeConnecter);
    nouvelleZonePrincipale.appendChild(motDePasseOublie);



    //Recuperation des identifiants tapés
    (document.getElementById('boutonSeConnecterLogIn')).addEventListener('click', () => {
        let email = document.getElementById('inputMail').value;
        let motDePasse = document.getElementById('inputMotDePasseLogIn').value;

        
        const chargeUtile = {
            email : email,
            password : motDePasse
        }

        const url ="http://localhost:5678/api/users/login";
        fetch (url, {
            method : "POST",
            headers : {"content-type":"application/json"},
            body : JSON.stringify(chargeUtile)
        })
        .then (reponse => {
            if (!reponse.ok){
                if ((reponse.status === 401) || (reponse.status === 404)) {alert("Erreur dans l'identifiant ou dans le mot de passe")};}
            else return (reponse.json());
        })
        .then (data => {
            // console.log(data);
            sessionStorage.setItem('utilisateur', data.id);
            sessionStorage.setItem('token', data.token);


            // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // Mode editeur ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            // Reconstruction du bandeau noir dedition
            siteGlobal.innerHTML="";
            const bandeauModeEditeur = document.createElement("div");
            const entete = document.createElement("header");
            const zonePrincipale = document.createElement("main");

            bandeauModeEditeur.setAttribute("id","bandeauNoir");

            bandeauModeEditeur.innerHTML =
            `<i class="fa-regular fa-pen-to-square icone0"></i>
            <p id="texteEdition">Mode édition</p>
            <a href="#">
                <input type="button" id="boutonPublication" value="publier les changements">
            </a>`;


            // Reconstruction de lentete avec menu
            entete.innerHTML = 
            `<h1>Sophie Bluel <span>Architecte d'intérieur</span></h1>
            <nav>
                <ul>
                    <li><a href="#portfolio">projets</a></li>
                    <li><a href="#contact">contact</a></li>
                    <li><a href="#formulaireConnection" id="logout">logout</a></li>
                    <a href>
                        <li><img src="./assets/icons/instagram.png" alt="Instagram"></li>
                    </a>
                </ul>
            </nav>`;


            // Reconstruction de la photo de larchitecte + texte
            zonePrincipale.innerHTML=
            `<section id="introduction">
                <figure>
                    <img src="./assets/images/sophie-bluel.png" alt="">
                </figure>
                <article>
                    <h2>Designer d'espace</h2>
                    <p>Je raconte votre histoire, je valorise vos idées. Je vous accompagne de la conception à la livraison finale du chantier.</p>
                    <p>Chaque projet sera étudié en commun, de façon à mettre en valeur les volumes, les matières et les couleurs dans le respect de l’esprit des lieux et le choix adapté des matériaux. Le suivi du chantier sera assuré dans le souci du détail, le respect du planning et du budget.</p>
                    <p>En cas de besoin, une équipe pluridisciplinaire peut-être constituée : architecte DPLG, décorateur(trice)</p>
                </article>
            </section>
            <div id="conteneurTexteAModifier1">
                <a href="#" id="modif1"><i class="fa-regular fa-pen-to-square icone1"></i>
                <p id="introAModifier">modifier</p></a>
            </div>`;

            siteGlobal.appendChild(bandeauModeEditeur);
            siteGlobal.appendChild(entete);
            siteGlobal.appendChild(zonePrincipale);

            document.getElementById("modif1").addEventListener("click", () => {
                alert('On vient dappuyer sur la modif1');
            });

            // On revient sur la page principale au click sur logout 
            document.getElementById("logout").addEventListener("click", () => {
                sessionStorage.setItem('utilisateur', '');
                sessionStorage.setItem('token', '');
                window.location.href="../FrontEnd/index.html";
            });

            const introductionModifiee = document.querySelector("section#introduction");
            introductionModifiee.setAttribute("class","introduction2");


            // Reconstruction de la Galerie + titre
            zonePrincipale.setAttribute("id", "zonePrincipale");
            const portfolio = document.createElement("section");
            portfolio.setAttribute("id", "portfolio");
            portfolio.setAttribute("class", "nouveauPortfolio");
            portfolio.innerHTML =
            `<div id="blocFantome"></div>
            <h2>Mes projets</h2>
            <a href="#mesProjets" id="modif2"><i class="fa-regular fa-pen-to-square icone2"></i>
            <p id="projetsAModifier">modifier</p></a>`;
            zonePrincipale.appendChild(portfolio);

            // Reconstruction de la zone de la Galerie
            const nouvelleGalerie = document.createElement("div");
            nouvelleGalerie.setAttribute("class","gallery");
            zonePrincipale.appendChild(nouvelleGalerie);
            creeGalerie();


            // Reconstruction du formulaire de contact
            const formulaireContact = document.createElement("section");
            formulaireContact.setAttribute("class","positionnement");
            formulaireContact.setAttribute("id","contact");
            formulaireContact.innerHTML=
            `<h2>Contact</h2>
            <p>Vous avez un projet ? Discutons-en !</p>
            <form action="#" method="post">
                <label for="name">Nom</label>
                <input type="text" name="name" id="name">
                <label for="email">Email</label>
                <input type="email" name="email" id="email">
                <label for="message">Message</label>
                <textarea name="message" id="message" cols="30" rows="10"></textarea>
                <input type="submit" value="Envoyer">
            </form>`;
            zonePrincipale.appendChild(formulaireContact);


            // Reconstruction du pied de page
            const piedDePage = document.createElement("footer");
            piedDePage.innerHTML=
            `<footer>
                <nav>
                    <ul>
                        <li id="mentionsLegales">Mentions Légales</li>
                    </ul>
                </nav>
            </footer>`;

            siteGlobal.appendChild(piedDePage);



            //////////////////////////////////////////////////////////////////////////////////////////////////////
            // Creation de la modale /////////////////////////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////////////////////////////////////
            document.getElementById("projetsAModifier").addEventListener('click' , () => {
                const modale = document.createElement("aside");
                modale.setAttribute("id","modale1");
                modale.setAttribute("class", "modale");
                // modale.setAttribute("style","display:none");
                modale.innerHTML = 
                `<div class="modalWrapper">
                    <div id="conteneurCroix">
                        <i class="fa-solid fa-xmark"></i>
                    </div>
                    <div id="conteneurTitreGalerie">
                    <h3>Galerie photo</h3>
                    </div>
                    <div id="conteneurGalerie">
                    </div>
                    <div id="conteneurChoixSurGalerie">
                        <div id="ligneHorizontaleSeparation"></div>
                        <button id="boutonAjoutPhoto">Ajouter une photo</button>
                        <p id="lienSuppressionGalerie">Supprimer la Galerie</p>
                    </div>
                </div>`;
                siteGlobal.appendChild(modale);



                // const GalerieMiniature = document.getElementById("conteneurGalerie");
                // GalerieMiniature.innerHTML = XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX;


                document.querySelector(".fa-xmark").addEventListener("click", () =>{
                    modale.setAttribute("style","display:none");
                    modale.remove();
                });

                window.addEventListener("click", (e) => {
                    if (e.target === modale) {
                        modale.setAttribute("style","display:none");
                        modale.remove();
                    } 
                });
            });
        });
    });
});



    // <figure id="conteneurImage">
    // <img src="" label="" alt="">
    // <div id="blocNoirEtCroix">
    //     <div id="cubeNoir"></div>
    //     <i class="fa-solid fa-up-down-left-right fa-2xs"></i>
    // </div>
    // <div id="blocNoirEtPoubelle">
    //     <div id="cubeNoir"></div>
    //     <i class="fa-regular fa-trash-can fa-2xs"></i>
    // </div>
    // <figcaption>éditer</figcaption>
    // </figure>