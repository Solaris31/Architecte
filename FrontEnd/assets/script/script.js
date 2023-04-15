const parentDesBoutons = document.querySelector('.conteneurBoutonFiltre');
const zonePrincipale = document.getElementById('zonePrincipaleMain');

// teste si toutes les variables sont bien fournies par larchitecte
let conditions=0;

// Chemin temporaire pour faire un preview du projet a ajouter
let urlTemporaire ="";

// Variables de la charge utile pour le fletch post
let fichier="";
let titre="";
let categorie=0;


sessionStorage.setItem('token',null);



async function vidangeGalerie() {
    const parentDeLaGalerie = document.querySelector('div.gallery');
    parentDeLaGalerie.innerHTML = "";
};


async function creeBoutons() {
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
        creeGalerie();
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
            if (bouton.checked) {creeGalerie(bouton.value);}
        });
    });
};


async function creeGalerie(categorie=0) {
    await vidangeGalerie();

    const reponse = await fetch("http://localhost:5678/api/works")
    const data = await reponse.json();

    if (categorie == -1) {
        projetsFiltres = data;
        return projetsFiltres;
    }
    else if (categorie == 0){
        projetsFiltres = data;
    }
    else {
        projetsFiltres = data.filter(projets => `${projets.categoryId}` == categorie);
    }


    const parentDeLaGallerie = document.querySelector('div.gallery');
    parentDeLaGallerie.innerHTML='';
    for (let i = 0 ; i < projetsFiltres.length ; i++) {
        const projet = document.createElement('figure');
        projet.innerHTML = `<img src="${projetsFiltres[i].imageUrl}" crossorigin="anonymous" alt="${projetsFiltres[i].title}">
        <figcaption>${projetsFiltres[i].title}</figcaption>`;
        parentDeLaGallerie.appendChild(projet);
    };
};


async function creeWrappeurPage1(){
    const modale = document.createElement("aside");
    modale.setAttribute("id","modale");
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
    await creeGalerie(-1).then(projetsFiltres);
    await afficheGalerieWrappeurPage1(projetsFiltres);


    // Fermeture modale par bouton croix
    document.querySelector(".fa-xmark").addEventListener("click", async () =>{
        // modale.setAttribute("style","display:none");
        modale.remove();
        await creeGalerie();
    });


    // Fermeture modale en cliquant a lexterieur du wrapeur
    window.addEventListener("click", async (e) => {
        if (e.target === modale) {
            // modale.setAttribute("style","display:none");
            modale.remove();
            await creeGalerie();
        } 
    });
};


async function afficheGalerieWrappeurPage1(projetsFiltres){
    
    const conteneurMiniGalerie = document.getElementById("conteneurMiniGalerie");

    const cubeNoirCroix=document.createElement("div");
    cubeNoirCroix.setAttribute("class","cubeNoirCroix");
    const iconeCroix=document.createElement("i");
    iconeCroix.classList.add("fa-solid","fa-up-down-left-right","fa-2xs");


    let i=1;
    for (projets of projetsFiltres){
        const figure=document.createElement("figure");
        figure.setAttribute("id",`figure${i}`);
        figure.setAttribute("class","miniFigure");
        figure.setAttribute("value",`${projets.id}`);
        

        const photoMiniature=document.createElement("img");
        photoMiniature.setAttribute("src",`${projets.imageUrl}`);
        photoMiniature.setAttribute("id","miniPhoto");
        photoMiniature.setAttribute("class",`miniPhoto${projets.id}`);
        photoMiniature.setAttribute("crossorigin","anonymous");
        photoMiniature.setAttribute("value",`${projets.id}`);
        photoMiniature.setAttribute("alt",`${projets.title}`);


        const cubeNoirPoubelle=document.createElement("div");
        cubeNoirPoubelle.setAttribute("id",`cubeNoirPoubelle${i}`);
        cubeNoirPoubelle.setAttribute("class","cubeNoirPoubelle");
        cubeNoirPoubelle.setAttribute("value",`${projets.id}`);


        const iconePoubelle=document.createElement("i");
        iconePoubelle.classList.add("fa-regular", "fa-trash-can", "fa-2xs");
        iconePoubelle.setAttribute("id",`poubelleNumero${projets.id}`);


        const titre=document.createElement("figcaption");
        titre.setAttribute("class","textPhoto");
        titre.setAttribute("id",`photoNumero${projets.id}`);
        titre.textContent="éditer";

        conteneurMiniGalerie.appendChild(figure);
        figure.appendChild(photoMiniature);
        figure.appendChild(cubeNoirPoubelle);
        cubeNoirPoubelle.appendChild(iconePoubelle);
        figure.appendChild(titre);


        const focusFigure = document.getElementById("figure"+i)
        focusFigure.addEventListener("mouseover", () => {
            focusFigure.appendChild(cubeNoirCroix);
            focusFigure.appendChild(iconeCroix);
        });

        focusFigure.addEventListener("mouseout", () => {
            focusFigure.removeChild(cubeNoirCroix);
            focusFigure.removeChild(iconeCroix);
        });
    i++;
    }
};


async function supprimeProjetUnitaire(id){
    await fetch (`http://localhost:5678/api/works/${id}`, {
        method : "DELETE",
        headers : {
            "accept" : "*/*" ,
            "Authorization" : "Bearer "+ sessionStorage.getItem("token")
        },
        body : undefined
    })
    .then ((reponse) => {
        if (reponse.ok) {
            return 1;
        }
    })
    .catch ((error) => {
        console.log(error);
    })
};


async function creeWrappeurPage2(){
    const modale = document.getElementById("modale");
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
    choix.setAttribute("value",0);
    choix.textContent="";
    selectionCategorie.appendChild(choix);

    const url="http://localhost:5678/api/categories";
    const reponse = await fetch(url);
    const data = await reponse.json();

    for (tableauData of data){
        const choix = document.createElement("option");
        choix.textContent=`${tableauData.name}`;
        choix.setAttribute("value",`${tableauData.id}`);
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


    blocBleuPourAfficherProjetAAjouter.appendChild(texteBoutonSelectionPhoto);
    conteneurActionsDuWrapeur.appendChild(blocAjoutDeProjet);
    blocAjoutDeProjet.appendChild(texteTitre);
    blocAjoutDeProjet.appendChild(saisieTitre);
    blocAjoutDeProjet.appendChild(texteCategorie);
    blocAjoutDeProjet.appendChild(selectionCategorie);
    blocAjoutDeProjet.appendChild(ligneHorizontaleSeparation2);
    blocAjoutDeProjet.appendChild(boutonValidation);


    boutonSelectionPhoto.addEventListener("click", async ()=> {
        boutonSelectionPhoto.removeAttribute(".class");
        fichierAEnvoyer.click();
    });


    saisieTitre.addEventListener("change", async ()=> {
        titre=`${saisieTitre.value}`;
        conditions=await conditionsPourValiderNouveauProjet();
    });


    fichierAEnvoyer.addEventListener("change", async (e)=> {
        // Chemin dacces pour le fetch 
        cheminProjet = `${fichierAEnvoyer.files[0].name}`;


        
        // Construction affichage image dans le wrappeur et pour la galerie
        const fichier = e.target.files[0]
        urlTemporaire = URL.createObjectURL(fichier);
                                    
        const parentNouvelleImage = document.getElementById("blocBleu");
        parentNouvelleImage.innerHTML="";
        const nouvelleImage = document.createElement("figure");
        parentNouvelleImage.appendChild(nouvelleImage);
        const definitionNouvelleImage = document.createElement("img");
        definitionNouvelleImage.setAttribute("id","definitionNouvelleImage");
        definitionNouvelleImage.setAttribute("src",urlTemporaire);
        definitionNouvelleImage.setAttribute("alt","Nouvelle image a inserer");
        definitionNouvelleImage.setAttribute("crossorigin","anonymous");
        nouvelleImage.appendChild(definitionNouvelleImage);

        conditions=await conditionsPourValiderNouveauProjet();
    });

    selectionCategorie.addEventListener("change", async ()=> {
        categorie = selectionCategorie.value;
        if (categorie != 0){
        // Construction charge utile
        conditions=await conditionsPourValiderNouveauProjet();
        }
    });

    iconeCroixFermeturePageEnCours.addEventListener("click", async () => {
        modale.remove();
        await creeGalerie();
        conditions=0;
    });

    iconeRetourPageAnterieure.addEventListener("click", async ()=>{
        modale.remove();
        await creeWrappeurPage1();
        document.getElementById("boutonAjoutPhoto").addEventListener("click", async () => {
            await creeWrappeurPage2();
        });
        conditions=0;
    });


    
    document.getElementById("boutonValidation").addEventListener("click", async () => {
        if (conditions==1){
            modale.remove();
            await creeGalerie();

            const parentDeLaGallerie = document.querySelector(".gallery");
            const nouvelleFigure = document.createElement('figure');
            parentDeLaGallerie.appendChild(nouvelleFigure);
            
            const nouveauProjet = document.createElement("img");
            nouveauProjet.setAttribute("src",`${urlTemporaire}`);
            nouveauProjet.setAttribute("crossorigin","anonymous");
            nouveauProjet.setAttribute("alt",`${saisieTitre.value}`);
            nouvelleFigure.appendChild(nouveauProjet);

            const legendeNouveauProjet=document.createElement("figcaption");
            legendeNouveauProjet.textContent=`${saisieTitre.value}`;
            nouvelleFigure.appendChild(legendeNouveauProjet);
        }
    });
};


async function conditionsPourValiderNouveauProjet(){
    const coloreDecoloreBoutonValidation=document.getElementById("boutonValidation");


    if((selectionCategorie.value != 0) && (fichierAEnvoyer.value != "") && (saisieTitre.value != "")) {

        coloreDecoloreBoutonValidation.classList.add("coloreMoiEnVert");
        const blocAjoutDeProjet=document.getElementById("blocAjoutDeProjet");
        const boutonValidation=document.getElementById("boutonValidation");
        boutonValidation.setAttribute("href","#");
        blocAjoutDeProjet.appendChild(boutonValidation);
        return 1;
    }
    else return 0;
};


async function creeGalerieModeEditeur(){

// Reconstruction du bandeau noir dedition
const siteGlobal = document.querySelector('body');

const bandeauModeEditeur = document.createElement("div");
bandeauModeEditeur.setAttribute("id","bandeauNoir");

bandeauModeEditeur.innerHTML =
`<i class="fa-regular fa-pen-to-square icone0"></i>
<p id="texteEdition">Mode édition</p>
<a href="#">
    <input type="button" id="boutonPublication" value="publier les changements">
</a>`;

siteGlobal.appendChild(bandeauModeEditeur);




// document.getElementById("modif1").addEventListener("click", () => {
//     alert('On vient dappuyer sur la modif1');
// });

// // On revient sur la page principale au click sur logout 
// document.getElementById("logout").addEventListener("click", () => {
//     sessionStorage.setItem('utilisateur', '');
//     sessionStorage.setItem('token', '');
//     window.location.href="../FrontEnd/index.html";
//     conditions=0;
// });

// const introductionModifiee = document.querySelector("section#introduction");
// introductionModifiee.setAttribute("class","introduction2");


// // Reconstruction de la Galerie + titre
// zonePrincipale.setAttribute("id", "zonePrincipale");
// const portfolio = document.createElement("section");
// portfolio.setAttribute("id", "portfolio");
// portfolio.setAttribute("class", "nouveauPortfolio");
// portfolio.innerHTML =
// `<div id="blocFantome"></div>
// <h2>Mes projets</h2>
// <a href="#mesProjets" id="modif2"><i class="fa-regular fa-pen-to-square icone2"></i>
// <p id="projetsAModifier">modifier</p></a>`;
// zonePrincipale.appendChild(portfolio);

// // Reconstruction de la zone de la Galerie
// const nouvelleGalerie = document.createElement("div");
// nouvelleGalerie.setAttribute("class","gallery");
// zonePrincipale.appendChild(nouvelleGalerie);

// await creeGalerie();

}


async function creeLeFormulaireLoginArchitecte(){

    const body=document.getElementById("body");

    const formulaireDeConnexionArchitecte = document.createElement("aside");
    formulaireDeConnexionArchitecte.setAttribute("id","formulaireDeConnexionArchitecte");

    const lienLogin = document.getElementById('login');
    lienLogin.setAttribute('class', 'nouveauStyleLogin');
    zonePrincipale.setAttribute('id', 'nouvelleZonePrincipale');
    zonePrincipale.innerHTML = "";

    const titreLogin = document.createElement('h2');
    titreLogin.setAttribute('id', 'titreLoginH2');

    const formulaire= document.createElement("form");
    formulaire.setAttribute("name","formulaire");
    formulaire.setAttribute("class","form");

    const labelEmail = document.createElement('label');
    labelEmail.setAttribute('for', 'email');
    labelEmail.setAttribute('id', 'texteEmailLogIn');

    const inputEmail = document.createElement('input');
    inputEmail.setAttribute('type', 'email');
    inputEmail.setAttribute('id', 'inputMail');
    inputEmail.setAttribute("autocomplete","on");

    const labelMotDePasse = document.createElement('label');
    labelMotDePasse.setAttribute('for', 'password');
    labelMotDePasse.setAttribute('id', 'texteMotDePasseLogIn');

    const inputMotDePasse = document.createElement('input');
    inputMotDePasse.setAttribute('type', 'password');
    inputMotDePasse.setAttribute('id', 'inputMotDePasseLogIn');
    inputMotDePasse.setAttribute("autocomplete","off");
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

    const mentionsLegales= document.createElement("footer");
    mentionsLegales.setAttribute("id", "footerFormulaireIdentification");
    mentionsLegales.textContent="Mentions légales";

    body.appendChild(formulaireDeConnexionArchitecte);
    formulaireDeConnexionArchitecte.appendChild(titreLogin);
    formulaireDeConnexionArchitecte.appendChild(formulaire);
    formulaire.appendChild(labelEmail);
    formulaire.appendChild(inputEmail);
    formulaire.appendChild(labelMotDePasse);
    formulaire.appendChild(inputMotDePasse);
    formulaire.appendChild(boutonSeConnecter);
    formulaire.appendChild(motDePasseOublie);
    body.appendChild(mentionsLegales);

    //Recuperation des identifiants tapés
    document.getElementById('boutonSeConnecterLogIn').addEventListener('click', async () => {

        const chargeUtile = { 
            email : "",
            password : "" };

        chargeUtile.email = document.getElementById('inputMail').value;
        chargeUtile.password = document.getElementById('inputMotDePasseLogIn').value;


        const url ="http://localhost:5678/api/users/login";
        await fetch (url, {
            method : "POST",
            headers : {"content-type":"application/json"},
            body : JSON.stringify(chargeUtile)
        })
        .then (async (reponse) => {
            if (!reponse.ok){
                if ((reponse.status === 401) || (reponse.status === 404)) {alert("Erreur dans l'identifiant ou dans le mot de passe")};
            }
            else {
                return (await reponse.json());
            };
        })
        .then (data => {
            sessionStorage.setItem('token', data.token);
            console.log("toto");
            return 1;
        })
        .catch( error => {
            return 0;
        });
    });
}



// On modifie la page principale en lui ajoutant des boutons et la galerie de projets
creeBoutons();
creeGalerie();



// Creation formulaire de login de larchitecte
document.getElementById("login").addEventListener("click", async () => {


    if (sessionStorage.getItem('token') == 'null') {
        // On cache la page principale 
        document.getElementById("zonePrincipaleMain").style.display="none";
        document.getElementById("footer").style.display="none";

        // Passage au formulaire didentification de larchitecte
        await creeLeFormulaireLoginArchitecte();

        console.log(sessionStorage.getItem("token"));
    };
});








