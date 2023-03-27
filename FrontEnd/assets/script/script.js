const siteGlobal = document.querySelector('body');
const parentDesBoutons = document.querySelector('.conteneurBoutonFiltre');
const zonePrincipale = document.getElementById('zonePrincipaleMain');



function vidangeGalerie() {
    const parentDeLaGalerie = document.querySelector('div.gallery');
    parentDeLaGalerie.innerHTML = "";
};


async function creeBoutonsPagePrincipale() {
    // Creation du bouton "Tous" + event listener //////////
    // /////////////////////////////////////////////////////
    const bouton0=document.createElement("input");
    bouton0.setAttribute("type","radio");
    bouton0.setAttribute("name","bouton");
    bouton0.setAttribute("class","boutonOrigine");
    bouton0.setAttribute("value","0");
    bouton0.setAttribute("id","boutonFiltreObjets0");
    bouton0.setAttribute("checked","");
    parentDesBoutons.appendChild(bouton0);

    const label0=document.createElement("label");
    label0.setAttribute("for","boutonFiltreObjets0");
    label0.setAttribute("class","btn bouton0");
    label0.textContent="Tous";
    parentDesBoutons.appendChild(label0);

    document.querySelector(".bouton0").addEventListener('click', () => {
       creeGaleriePagePrincipale();
    });


    // Creation des boutons "Objets", "Appartements", "Hotels et restaurants" + event listener ///////////////
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////
    const url = 'http://localhost:5678/api/categories';
    const reponse = await fetch(url);
    const data = await reponse.json();


    for (valeursDeData of data) {
        const boutonX=document.createElement("input");
        boutonX.setAttribute("type","radio");
        boutonX.setAttribute("name","bouton");
        boutonX.setAttribute("class","bouton");
        boutonX.setAttribute("value",`${valeursDeData.id}`);
        boutonX.setAttribute("id",`boutonFiltreObjets${valeursDeData.id}`);
        parentDesBoutons.appendChild(boutonX);

        const labelX=document.createElement("label");
        labelX.setAttribute("for", `boutonFiltreObjets${valeursDeData.id}`);
        labelX.setAttribute("class", `btn bouton${valeursDeData.id}`);
        labelX.textContent=`${valeursDeData.name}`;
        parentDesBoutons.appendChild(labelX);
    };
    
    document.querySelectorAll(".bouton").forEach(bouton => {
        bouton.addEventListener('click', () => {
            if (bouton.checked) {creeGaleriePagePrincipale(bouton.value);}
        });
    });
};


async function creeGaleriePagePrincipale(categorie=0) {
    vidangeGalerie();

    await fetch("http://localhost:5678/api/works")
        .then(reponse => reponse.json())
        .then(data => {
            if (categorie == -1) {
                projetsFiltres = data;
                return projetsFiltres;
            }
            else if (categorie == 0){
                projetsFiltres = data;
                afficheGaleriePagePrincipale(projetsFiltres);
            }
            else {
                projetsFiltres = data.filter(projets => `${projets.categoryId}` == categorie);
                afficheGaleriePagePrincipale(projetsFiltres);
            }
        });
};


function afficheGaleriePagePrincipale(projetsFiltres){

    const parentDeLaGallerie = document.querySelector('div.gallery');
    parentDeLaGallerie.innerHTML='';
    for (projets of projetsFiltres) {
        const projet = document.createElement('figure');
        projet.innerHTML = `<img src="${projets.imageUrl}" crossorigin="anonymous" alt="${projets.title}">
        <figcaption>${projets.title}</figcaption>`;
        parentDeLaGallerie.appendChild(projet);
    };
};


function creeWrappeurPage1(){
    const modale = document.createElement("aside");
    modale.setAttribute("id","modale1");
    modale.setAttribute("class", "modale");
    modale.innerHTML = 
    `<div class="modalWrapper">
        <div id="conteneurActionsDuWrapeur">
            <div id="conteneurCroix">
                <i class="fa-solid fa-xmark"></i>
            </div>
            <div id="conteneurTitreGalerie">
                <h3>Galerie photo</h3>
            </div>
            <div id="conteneurMiniGalerie"></div>
            <div id="conteneurChoixSurGalerie">
                <div id="ligneHorizontaleSeparation"></div>
                <button id="boutonAjoutPhoto">Ajouter une photo</button>
                <p id="lienSuppressionGalerie">Supprimer la Galerie</p>
            </div>
        </div>
    </div>`;
    siteGlobal.appendChild(modale);

    
    //  Creation de la mini galerie dans la modale page1
    creeGaleriePagePrincipale(-1).then(projetsFiltres);
    afficheMiniGalerieWrappeurPage1(projetsFiltres);

    // Fermeture modale par bouton croix ou en cliquant a lexterieur du wrapeur

    document.querySelector(".fa-xmark").addEventListener("click", () =>{
        // modale.setAttribute("style","display:none");
        modale.remove();
        creeGaleriePagePrincipale();

    });
    window.addEventListener("click", (e) => {
        if (e.target === modale) {
            // modale.setAttribute("style","display:none");
            modale.remove();
            creeGaleriePagePrincipale();
        } 
    });
};


function afficheMiniGalerieWrappeurPage1(projetsFiltres){
    const conteneurMiniGalerie = document.getElementById("conteneurMiniGalerie");

    const cubeNoirCroix=document.createElement("div");
    cubeNoirCroix.setAttribute("class","cubeNoirCroix");
    const iconeCroix=document.createElement("i");
    iconeCroix.classList.add("fa-solid","fa-up-down-left-right","fa-2xs");


    for (projets of projetsFiltres){
        const figure=document.createElement("figure");
        figure.setAttribute("id",`figure${projets.id}`);
        figure.setAttribute("class","miniFigure");
        
        const photoMiniature=document.createElement("img");
        photoMiniature.setAttribute("src",`${projets.imageUrl}`);
        photoMiniature.setAttribute("id","miniPhoto");
        photoMiniature.setAttribute("class",`miniPhoto${projets.id}`);
        photoMiniature.setAttribute("crossorigin","anonymous");
        photoMiniature.setAttribute("value",`${projets.id}`);
        photoMiniature.setAttribute("alt",`${projets.title}`);
        
        const cubeNoirPoubelle=document.createElement("div");
        cubeNoirPoubelle.setAttribute("id",`cubeNoirPoubelle${projets.id}`);
        cubeNoirPoubelle.setAttribute("class","cubeNoirPoubelle");

        const iconePoubelle=document.createElement("i");
        iconePoubelle.classList.add("fa-regular", "fa-trash-can", "fa-2xs");
        iconePoubelle.setAttribute("id",`poubelleNumero${projets.id}`)

        const titre=document.createElement("figcaption");
        titre.setAttribute("class","textPhoto");
        titre.setAttribute("id",`photoNumero${projets.id}`);
        titre.textContent="éditer";

        conteneurMiniGalerie.appendChild(figure);
        figure.appendChild(photoMiniature);
        figure.appendChild(cubeNoirPoubelle);
        figure.appendChild(iconePoubelle);
        figure.appendChild(titre);
    }


    for (let i=1 ; i<=projetsFiltres.length ; i++ ) {
        const focusFigure = document.getElementById("figure"+i)
        focusFigure.addEventListener("mouseover", () => {
            focusFigure.appendChild(cubeNoirCroix);
            focusFigure.appendChild(iconeCroix);
        });
    };


    for (let i=1 ; i<=projetsFiltres.length ; i++ ) {
        const focusFigure = document.getElementById("figure"+i)
        focusFigure.addEventListener("mouseout", () => {
            focusFigure.removeChild(cubeNoirCroix);
            focusFigure.removeChild(iconeCroix);
        });
    };
};


creeBoutonsPagePrincipale();
creeGaleriePagePrincipale();



// Creation formulaire de login de larchitecte ////////////////////////////
// ////////////////////////////////////////////////////////////////////////
document.getElementById("login").addEventListener("click", () => {


    const lienLogin = document.getElementById('login');
    lienLogin.setAttribute('class', 'nouveauStyleLogin');

    zonePrincipale.setAttribute('id', 'nouvelleZonePrincipale');
    zonePrincipale.innerHTML = "";

    const titreLogin = document.createElement('h2');
    titreLogin.setAttribute('id', 'titreLoginH2');

    const labelEmail = document.createElement('label');
    labelEmail.setAttribute('for', 'email');
    labelEmail.setAttribute('id', 'texteEmailLogIn');

    const inputEmail = document.createElement('input');
    inputEmail.setAttribute('type', 'email');
    inputEmail.setAttribute('id', 'inputMail');

    const labelMotDePasse = document.createElement('label');
    labelMotDePasse.setAttribute('for', 'password');
    labelMotDePasse.setAttribute('id', 'texteMotDePasseLogIn');

    const inputMotDePasse = document.createElement('input');
    inputMotDePasse.setAttribute('type', 'password');
    inputMotDePasse.setAttribute('id', 'inputMotDePasseLogIn');
    titreLogin.innerHTML = `Log In</h2>`;
    labelEmail.innerHTML = `E-mail</label>`;
    inputEmail.innerHTML = `</input>`;
    labelMotDePasse.innerHTML = `Mot de passe</label>`;
    inputMotDePasse.innerHTML = `</input>`;

    const boutonSeConnecter = document.createElement('input');
    boutonSeConnecter.setAttribute('type', 'button');
    boutonSeConnecter.setAttribute('id', 'boutonSeConnecterLogIn');
    boutonSeConnecter.setAttribute('value', 'Se connecter');
    boutonSeConnecter.innerHTML = `</input>`;

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

            creeGaleriePagePrincipale();


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


            
            ////////////////////////////////////////////////////////////////////////////////////////////////////
            // Creation de la modale page 1 ////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////
            document.getElementById("projetsAModifier").addEventListener('click' , () => {
                creeWrappeurPage1();


                ////////////////////////////////////////////////////////////////////////////////////////////////////
                // Creation de la modale ///////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////////

                const url="http://localhost:5678/api/categories";
                fetch(url)
                    .then(response => response.json())
                    .then(data => {

                    // Passage au wrapeur page2 pour ajouter un projet
                    document.getElementById("boutonAjoutPhoto").addEventListener("click", () =>{
                        const modale2=document.querySelector(".modalWrapper");
                        modale2.removeAttribute("class","modalWrapper");
                        modale2.setAttribute("class","modale2Wrappeur");

                        const conteneurActionsDuWrapeur = document.getElementById("conteneurActionsDuWrapeur");
                        conteneurActionsDuWrapeur.setAttribute("class","conteneurActionsDuWrapeurPage2");
                        conteneurActionsDuWrapeur.innerHTML="";
                        const conteneurBoutonNavigation=document.createElement("nav");
                        conteneurBoutonNavigation.setAttribute("id","nav");
                        
                        const iconeRetourPageAnterieure=document.createElement("i");
                        iconeRetourPageAnterieure.classList.add("fa-solid","fa-arrow-left");
                        const iconeCroixFermeturePageEnCours=document.createElement("i");
                        iconeCroixFermeturePageEnCours.classList.add("fa-solid","fa-xmark");

                        const titreAjoutPhoto= document.createElement("h3");
                        titreAjoutPhoto.setAttribute("id","titreAjoutPhoto");
                        titreAjoutPhoto.textContent="Ajout photo";

                        const blocBleuPourAfficherProjetAAjouter=document.createElement("div");
                        blocBleuPourAfficherProjetAAjouter.setAttribute("id","blocBleu");

                        const imageChematique=document.createElement("i");
                        imageChematique.classList.add("fa-sharp","fa-regular","fa-image");

                        const boutonSelectionPhoto=document.createElement("div");
                        boutonSelectionPhoto.setAttribute("id","boutonSelectionPhoto");

                        const texteBoutonSelectionPhoto=document.createElement("h4");
                        texteBoutonSelectionPhoto.setAttribute("id","texteBoutonSelectionPhoto");
                        texteBoutonSelectionPhoto.textContent="jpg, png : 4mo max";

                        const blocAjoutDeProjet=document.createElement("div");
                        blocAjoutDeProjet.setAttribute("id","blocAjoutDeProjet");

                        const texteTitre=document.createElement("label");
                        texteTitre.textContent="Titre";
                        texteTitre.setAttribute("id","texteTitre");
                        
                        const saisieTitre=document.createElement("input");
                        saisieTitre.setAttribute("id","saisieTitre");

                        const texteCategorie=document.createElement("label");
                        texteCategorie.textContent="Catégorie";
                        texteCategorie.setAttribute("id","texteCategorie");
                        
                        const selectionCategorie=document.createElement("select");
                        selectionCategorie.setAttribute("id","selectionCategorie");

                        // Selection de la categorie dans une input type select
                        const choix = document.createElement("option");
                        choix.setAttribute("id",0);
                        choix.textContent="";
                        selectionCategorie.appendChild(choix);

                        for (tableauData of data){
                            const choix = document.createElement("option");
                            choix.textContent=`${tableauData.name}`;
                            choix.setAttribute("id",`${tableauData.id}`);
                            selectionCategorie.appendChild(choix);
                        };
                        
                        const ligneHorizontaleSeparation2=document.createElement("div");
                        ligneHorizontaleSeparation2.setAttribute("id","ligneHorizontaleSeparation2");

                        const boutonValidation=document.createElement("bouton");
                        boutonValidation.setAttribute("id","boutonValidation");
                        
                        conteneurActionsDuWrapeur.appendChild(conteneurBoutonNavigation);
                        conteneurBoutonNavigation.appendChild(iconeRetourPageAnterieure);
                        conteneurBoutonNavigation.appendChild(iconeCroixFermeturePageEnCours);
                        conteneurActionsDuWrapeur.appendChild(titreAjoutPhoto);
                        conteneurActionsDuWrapeur.appendChild(blocBleuPourAfficherProjetAAjouter);
                        blocBleuPourAfficherProjetAAjouter.appendChild(imageChematique);
                        blocBleuPourAfficherProjetAAjouter.appendChild(boutonSelectionPhoto);

                        // Ici on cree une zone input file sur bouton,
                        // on le rend invisible, et au click on ouvre une fenetre de selection
                        const fichierAEnvoyer = document.createElement("input");
                        fichierAEnvoyer.setAttribute("type","file");
                        fichierAEnvoyer.setAttribute("id","fichierAEnvoyer");
                        blocAjoutDeProjet.appendChild(fichierAEnvoyer);

                        boutonSelectionPhoto.addEventListener("click",()=>{
                            fichierAEnvoyer.click();
                        });

                        fichierAEnvoyer.addEventListener("change", () => {
                            const fichierSelectionne = fichierAEnvoyer.files[0];
                            console.log(fichierSelectionne);
                            // const cheminFichierSelectionne = URL.createObjectURL(fichierSelectionne);
                            // console.log(cheminFichierSelectionne);
                        });

                        blocBleuPourAfficherProjetAAjouter.appendChild(texteBoutonSelectionPhoto);
                        conteneurActionsDuWrapeur.appendChild(blocAjoutDeProjet);
                        blocAjoutDeProjet.appendChild(texteTitre);
                        blocAjoutDeProjet.appendChild(saisieTitre);
                        blocAjoutDeProjet.appendChild(texteCategorie);
                        blocAjoutDeProjet.appendChild(selectionCategorie);
                        blocAjoutDeProjet.appendChild(ligneHorizontaleSeparation2);
                        blocAjoutDeProjet.appendChild(boutonValidation);

                        boutonValidation.addEventListener("click", () =>{
                            boutonValidation.preventDefault();
                            console.log("saisie du titre : "+saisieTitre.value);
                            console.log("saisie de la categorie : "+saisieCategorie.value);
                        });

                        iconeCroixFermeturePageEnCours.addEventListener("click", () => {
                            modale1.remove();
                            creeGaleriePagePrincipale();
                            creeGaleriePagePrincipale(-1).then(projetsFiltres);
                            afficheMiniGalerieWrappeurPage1(projetsFiltres);
                        });

                        iconeRetourPageAnterieure.addEventListener("click", () =>{
                            modale1.remove();
                            creeGaleriePagePrincipale();
                            creeGaleriePagePrincipale(-1).then(projetsFiltres);
                            afficheMiniGalerieWrappeurPage1(projetsFiltres);             
                        });
                    });
                });
            });
        });
    });
});



// const selectElement = document.querySelector('.ice-cream');
// selectElement.addEventListener('change', (event) => {
//   const result = document.querySelector('.result');
//   result.textContent = `You like ${event.target.value}`;/
// });