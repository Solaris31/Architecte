
// Variables de la charge utile pour le fletch post
let fichier = "";
let titre = "";
let categorie = 0;

// Initialisation du token de larchitecte
sessionStorage.setItem('token', null);


// Cree autant de boutons que de filtres defini dans l'API "categories"
async function creeBoutons() {
    // Creation du bouton "Tous" + event listener //////////
    // /////////////////////////////////////////////////////
    const parentDesBoutons = document.querySelector('.conteneurBoutonFiltre');
    const bouton0 = document.createElement("input");
    bouton0.setAttribute("type", "radio");
    bouton0.setAttribute("name", "bouton");
    bouton0.setAttribute("class", "boutonOrigine");
    bouton0.setAttribute("value", "0");
    bouton0.setAttribute("id", "boutonFiltreObjets0");
    bouton0.setAttribute("checked", "");
    parentDesBoutons.appendChild(bouton0);

    const label0 = document.createElement("label");
    label0.setAttribute("for", "boutonFiltreObjets0");
    label0.setAttribute("class", "btn bouton0");
    label0.textContent = "Tous";
    parentDesBoutons.appendChild(label0);

    document.querySelector(".bouton0").addEventListener('click', () => {
        creeGalerie();
    });


    // Creation de tous les autres boutons definis dans lAPI "categories" + event listener ///////////////
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////
    await fetch("http://localhost:5678/api/categories", {
        method: "GET",
        body: null,
        headers: {
            "Content-Type": "application/json",
        },
    }) // Promesse1
        .then(async (reponse) => {
            if (!reponse.ok) alert("Erreur de connexion");
            return reponse.json();
        })
        // Promesse2
        .then(async (data) => {
            for (valeursDeData of data) {
                const boutonX = document.createElement("input");
                boutonX.setAttribute("type", "radio");
                boutonX.setAttribute("name", "bouton");
                boutonX.setAttribute("class", "bouton");
                boutonX.setAttribute("value", `${valeursDeData.id}`);
                boutonX.setAttribute("id", `boutonFiltreObjets${valeursDeData.id}`);
                parentDesBoutons.appendChild(boutonX);

                const labelX = document.createElement("label");
                labelX.setAttribute("for", `boutonFiltreObjets${valeursDeData.id}`);
                labelX.setAttribute("class", `btn bouton${valeursDeData.id}`);
                labelX.textContent = `${valeursDeData.name}`;
                parentDesBoutons.appendChild(labelX);
            };

            document.querySelectorAll(".bouton").forEach(bouton => {
                bouton.addEventListener('click', () => {
                    if (bouton.checked) { creeGalerie(bouton.value); }
                });
            });
        })
        .catch((error) => {
            console.error("Erreur dans la requete : ", error);
        })
};


// creation de la gallerie de projets (Page principale, mode edition, et wrappeur1)
async function creeGalerie(categorie = 0) {

    const parentDeLaGalerie = document.querySelector('div.gallery');

    await fetch("http://localhost:5678/api/works", {
        method: "GET",
        body: null,
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(async (reponse) => {
            if (!reponse.ok) console.log("Erreur dacces aux donnees");
            return reponse.json();
        })
        .then(async (data) => {
            // Tous les projets sont recupérés pour de la galerie du wrappeur1
            if (categorie == -1) {
                projetsFiltres = data;
                return projetsFiltres;
            }
            // Tous les projets sont affichés (0 par defaut) dans la fenetre principale ou le mode edition
            else if (categorie == 0) {
                parentDeLaGalerie.innerHTML = "";
                projetsFiltres = data;
            }
            // Les projets sont filtrés selon le parametre choisi pour un affichage dans la fenetre principale ou le mode edition
            else {
                parentDeLaGalerie.innerHTML = "";
                projetsFiltres = data.filter(projets => `${projets.categoryId}` == categorie);
            }

            for (let i = 0; i < projetsFiltres.length; i++) {
                const projet = document.createElement('figure');
                projet.innerHTML = `<img src="${projetsFiltres[i].imageUrl}" crossorigin="anonymous" alt="${projetsFiltres[i].title}">
            <figcaption id="titreImage">${projetsFiltres[i].title}</figcaption>`;
                parentDeLaGalerie.appendChild(projet);
            }

        })
        .catch((error) => {
            console.error("Erreur dans lappel fetch : ", error);
        })
}


// Cree le wrappeur1 contenant tous les projets en miniatures, elle permet des suppressions de projets et des ajouts.
async function creeWrappeur1() {

    const siteGlobal = document.getElementById("body");

    const modale = document.createElement("aside");
    modale.setAttribute("id", "modale");
    modale.setAttribute("class", "modale");
    modale.innerHTML =
        `<div class="wrappeur1">
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


    //  Creation de la mini galerie dans la modale
    await creeGalerie(-1).then(projetsFiltres);
    await afficheGalerieWrappeur1(projetsFiltres);

    // Fermeture modale par bouton croix
    document.querySelector(".fa-xmark").addEventListener("click", async () => {
        modale.remove();
        await creeGalerie();
    });

    // Fermeture modale en cliquant a lexterieur de la modale
    window.addEventListener("click", async (e) => {
        if (e.target == modale) {
            modale.remove();
            await creeGalerie();
        }
    });
};


// Affiche dans le wrappeur1, la galerie en miniature
async function afficheGalerieWrappeur1(projetsFiltres) {

    const conteneurMiniGalerie = document.getElementById("conteneurMiniGalerie");

    const cubeNoirCroix = document.createElement("div");
    cubeNoirCroix.setAttribute("class", "cubeNoirCroix");
    const iconeCroix = document.createElement("i");
    iconeCroix.classList.add("fa-solid", "fa-up-down-left-right", "fa-2xs");

    let i = 1;
    for (projets of projetsFiltres) {
        const figure = document.createElement("figure");
        figure.setAttribute("id", `figure${i}`);
        figure.setAttribute("class", "miniFigure");
        figure.setAttribute("value", `${projets.id}`);

        const photoMiniature = document.createElement("img");
        photoMiniature.setAttribute("src", `${projets.imageUrl}`);
        photoMiniature.setAttribute("id", "miniPhoto");
        photoMiniature.setAttribute("class", `miniPhoto${projets.id}`);
        photoMiniature.setAttribute("crossorigin", "anonymous");
        photoMiniature.setAttribute("value", `${projets.id}`);
        photoMiniature.setAttribute("alt", `${projets.title}`);

        const cubeNoirPoubelle = document.createElement("div");
        cubeNoirPoubelle.setAttribute("id", `cubeNoirPoubelle${i}`);
        cubeNoirPoubelle.setAttribute("class", "cubeNoirPoubelle");
        cubeNoirPoubelle.setAttribute("valeur", `${projets.id}`);

        const iconePoubelle = document.createElement("i");
        iconePoubelle.classList.add("fa-regular", "fa-trash-can", "fa-2xs");
        iconePoubelle.setAttribute("id", `poubelleNumero${projets.id}`);


        const titre = document.createElement("figcaption");
        titre.setAttribute("class", "textPhoto");
        titre.setAttribute("id", `photoNumero${projets.id}`);
        titre.textContent = "éditer";

        conteneurMiniGalerie.appendChild(figure);
        figure.appendChild(photoMiniature);
        figure.appendChild(cubeNoirPoubelle);
        cubeNoirPoubelle.appendChild(iconePoubelle);
        figure.appendChild(titre);

        const focusFigure = document.getElementById("figure" + i)
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


    // Suppression individuelle au click sur une poubelle
    document.querySelectorAll(".cubeNoirPoubelle").forEach(cubeNoir => {
        cubeNoir.addEventListener("click", () => {
            try {
                supprimeProjetUnitaire(cubeNoir.getAttribute("valeur"));
            }
            catch {
                alert("Erreur dans la suppression dun projet " + cubeNoir.getAttribute("valeur"));
            }
        });
    });


    // Suppression complete de tous les projets
    document.getElementById("lienSuppressionGalerie").addEventListener("click", () => {
        document.querySelectorAll(".cubeNoirPoubelle").forEach(cubeNoir => {
            supprimeProjetUnitaire(cubeNoir.getAttribute("valeur"));
        });
    });


    // Ajout dun projet
    document.getElementById("boutonAjoutPhoto").addEventListener("click", async () => {
        await creeWrappeur2();
    });
};


// Supprime un projet en fonction de la valeur passée en parametre
function supprimeProjetUnitaire(id) {
    fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        body: null,
        headers: {
            "Content-Type": "*/*",
            "Authorization": "Bearer " + sessionStorage.getItem("token"),
        },
    })
        .then(async (reponse) => {
            if (!reponse.ok) { alert("Erreur lors de la suppression"); return reponse.json(); }
            else {
                modale.remove();
                await creeWrappeur1();
            };
        })
        .catch((error) => {
            console.error("Erreur dans lappel fetch : ", error);
        })
};


// Cree le wrappeur2 (en position fixed) qui permet dajouter un projet
async function creeWrappeur2() {
    let cheminProjet = {};
    let conditions = 0;

    const body = document.querySelector("body");
    document.getElementById("modale").remove();

    const modale = document.createElement("aside");
    modale.setAttribute("class", "modale");
    body.appendChild(modale);

    const wrappeur2 = document.createElement("div");
    wrappeur2.setAttribute("class", "wrappeur2");
    modale.appendChild(wrappeur2);
    const conteneurActionsDuWrapeur = document.createElement("div");
    wrappeur2.appendChild(conteneurActionsDuWrapeur);
    conteneurActionsDuWrapeur.setAttribute("class", "conteneurActionsDuWrapeurPage2");
    const conteneurBoutonNavigation = document.createElement("nav");
    conteneurBoutonNavigation.setAttribute("id", "nav");
    const iconeRetourPageAnterieure = document.createElement("i");
    iconeRetourPageAnterieure.classList.add("fa-solid", "fa-arrow-left");
    const iconeCroixFermeturePageEnCours = document.createElement("i");
    iconeCroixFermeturePageEnCours.classList.add("fa-solid", "fa-xmark");

    // Selection du fichier image a ajouter
    const titreAjoutPhoto = document.createElement("h3");
    titreAjoutPhoto.setAttribute("id", "titreAjoutPhoto");
    titreAjoutPhoto.textContent = "Ajout photo";
    const blocBleuPourAfficherProjetAAjouter = document.createElement("div");
    blocBleuPourAfficherProjetAAjouter.setAttribute("id", "blocBleu");

    const imageChematique = document.createElement("i");
    imageChematique.classList.add("fa-sharp", "fa-regular", "fa-image");

    const boutonSelectionPhoto = document.createElement("div");
    boutonSelectionPhoto.setAttribute("id", "boutonSelectionPhoto");

    const texteBoutonSelectionPhoto = document.createElement("h4");
    texteBoutonSelectionPhoto.setAttribute("id", "texteBoutonSelectionPhoto");
    texteBoutonSelectionPhoto.textContent = "jpg, png : 4mo max";

    const blocAjoutDeProjet = document.createElement("div");
    blocAjoutDeProjet.setAttribute("id", "blocAjoutDeProjet");

    const texteTitre = document.createElement("label");
    texteTitre.textContent = "Titre";
    texteTitre.setAttribute("id", "texteTitre");

    // Saisie du titre
    const saisieTitre = document.createElement("input");
    saisieTitre.setAttribute("id", "saisieTitre");
    const texteCategorie = document.createElement("label");
    texteCategorie.textContent = "Catégorie";
    texteCategorie.setAttribute("id", "texteCategorie");

    // Selection de la categorie dans une input type select (menu deroulant)
    const selectionCategorie = document.createElement("select");
    selectionCategorie.setAttribute("id", "selectionCategorie");

    const choix = document.createElement("option");
    choix.setAttribute("value", 0);
    choix.textContent = "";
    selectionCategorie.appendChild(choix);

    await fetch("http://localhost:5678/api/categories", {
        method: "GET",
        body: null,
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(async (reponse) => {
            if (!reponse.ok) {
                console.log("Erreur de connexion fetch");
            }
            return reponse.json();
        })
        .then(async (data) => {
            for (tableauData of data) {
                const choix = document.createElement("option");
                choix.textContent = `${tableauData.name}`;
                choix.setAttribute("value", `${tableauData.id}`);
                selectionCategorie.appendChild(choix);
            };
        })
        .catch(async (error) => {
            console.error("Erreur : ", error);
        })

    const ligneHorizontaleSeparation2 = document.createElement("div");
    ligneHorizontaleSeparation2.setAttribute("id", "ligneHorizontaleSeparation2");

    const boutonValidation = document.createElement("bouton");
    boutonValidation.setAttribute("id", "boutonValidation");

    conteneurActionsDuWrapeur.appendChild(conteneurBoutonNavigation);
    conteneurBoutonNavigation.appendChild(iconeRetourPageAnterieure);
    conteneurBoutonNavigation.appendChild(iconeCroixFermeturePageEnCours);
    conteneurActionsDuWrapeur.appendChild(titreAjoutPhoto);
    conteneurActionsDuWrapeur.appendChild(blocBleuPourAfficherProjetAAjouter);
    blocBleuPourAfficherProjetAAjouter.appendChild(imageChematique);
    blocBleuPourAfficherProjetAAjouter.appendChild(boutonSelectionPhoto);

    // On cree une zone input file sur bouton et on le rend invisible.
    // Au click on ouvre une fenetre de selection
    const fichierAEnvoyer = document.createElement("input");
    fichierAEnvoyer.setAttribute("type", "file");
    fichierAEnvoyer.setAttribute("id", "fichierAEnvoyer");
    fichierAEnvoyer.setAttribute("accept", ".jpg, .png");
    blocAjoutDeProjet.appendChild(fichierAEnvoyer);


    blocBleuPourAfficherProjetAAjouter.appendChild(texteBoutonSelectionPhoto);
    conteneurActionsDuWrapeur.appendChild(blocAjoutDeProjet);
    blocAjoutDeProjet.appendChild(texteTitre);
    blocAjoutDeProjet.appendChild(saisieTitre);
    blocAjoutDeProjet.appendChild(texteCategorie);
    blocAjoutDeProjet.appendChild(selectionCategorie);
    blocAjoutDeProjet.appendChild(ligneHorizontaleSeparation2);
    blocAjoutDeProjet.appendChild(boutonValidation);


    // Declenchement de linput file
    boutonSelectionPhoto.addEventListener("click", async () => {
        fichierAEnvoyer.click();
    });

    // Declenchement de linput pour de la saisie texte
    saisieTitre.addEventListener("keyup", async () => {
        titre = `${saisieTitre.value}`;
        conditions = await conditionsPourValiderNouveauProjet();
    });


    fichierAEnvoyer.addEventListener("change", async (e) => {
        // Chemin dacces relatif pour le fetch
        cheminProjet = fichierAEnvoyer.files[0];

        // Construction du chemin dacces absolue, et affichage de la nouvelle image dans le wrappeur2
        const fichier = e.target.files[0];
        urlTemporaire = URL.createObjectURL(fichier);

        const parentNouvelleImage = document.getElementById("blocBleu");
        parentNouvelleImage.innerHTML = "";
        const nouvelleImage = document.createElement("figure");
        parentNouvelleImage.appendChild(nouvelleImage);
        const definitionNouvelleImage = document.createElement("img");
        definitionNouvelleImage.setAttribute("id", "definitionNouvelleImage");
        definitionNouvelleImage.setAttribute("src", urlTemporaire);
        definitionNouvelleImage.setAttribute("alt", "Nouvelle image a inserer");
        definitionNouvelleImage.setAttribute("crossorigin", "anonymous");
        nouvelleImage.appendChild(definitionNouvelleImage);

        conditions = await conditionsPourValiderNouveauProjet();
    });

    // Declenchement de linput option (menu deroulant)
    selectionCategorie.addEventListener("change", async () => {
        categorie = selectionCategorie.value;
        conditions = await conditionsPourValiderNouveauProjet();
    });

    // Fermeture wrappeur2 et retour a la page mode edition en cliquant sur licone "croix"
    iconeCroixFermeturePageEnCours.addEventListener("click", async () => {
        modale.remove();
        await creeGalerie();
    });

    // Fermeture wrappeur2 et retour au wrappeur1 en cliquant sur la licone "retour"
    iconeRetourPageAnterieure.addEventListener("click", async () => {
        modale.remove();
        await creeWrappeur1();
    });

    // Fermeture wrappeur2 et retour au wrappeur1 en cliquant a lexterieur du wrappeur2
    window.addEventListener("click", (e) => {
        if (e.target == modale) {
            modale.remove();
            creeWrappeur1();
        }
    });

    document.getElementById("boutonValidation").addEventListener("click", async () => {
        const formData = new FormData();
        formData.append('image', cheminProjet);
        formData.append('title', titre);
        formData.append('category', categorie);
        // console.log("title : " + formData.get("title"));

        fetch("http://localhost:5678/api/works", {
            method: "POST",
            body: formData,
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("token"),
            },
        })
            .then(async (reponse) => {
                if (!reponse.ok) alert("Erreur dans l'ajout du projet");
                return reponse.json();
            })
            .then(async (data) => {
                modale.remove();
                const boutonPublication = document.getElementById("boutonPublication");
                boutonPublication.classList.add("activationDuBoutonPublication");

                boutonPublication.addEventListener("click", () => {
                    creeGalerie(0);
                    boutonPublication.classList.remove("activationDuBoutonPublication");
                });
            })
            .catch((error) => {
                console.error("Erreur de creation de projet : ", error);
            });
    });
};


// Teste dans le modale2, si les 3 champs demandés pour lajout de projet sont bien fournis
async function conditionsPourValiderNouveauProjet() {
    const coloreDecoloreBoutonValidation = document.getElementById("boutonValidation");

    if ((categorie != 0) && (fichierAEnvoyer.value != "") && (titre != "")) {

        coloreDecoloreBoutonValidation.classList.add("coloreMoiEnVert");
        const blocAjoutDeProjet = document.getElementById("blocAjoutDeProjet");
        const boutonValidation = document.getElementById("boutonValidation");
        boutonValidation.setAttribute("href", "#");
        blocAjoutDeProjet.appendChild(boutonValidation);
        conditions = 0;
    }
    else {
        coloreDecoloreBoutonValidation.classList.remove("coloreMoiEnVert");
        const blocAjoutDeProjet = document.getElementById("blocAjoutDeProjet");
        const boutonValidation = document.getElementById("boutonValidation");
        boutonValidation.removeAttribute("href", "#");
        blocAjoutDeProjet.appendChild(boutonValidation);
    }
};


// Affiche la page principale du site en mode edition pour larchitecte
async function creePageArchitecteModeEditeur() {


    // Reconstruction du bandeau noir dedition
    const siteGlobal = document.getElementById('body');
    const bandeauModeEditeur = document.createElement("div");
    bandeauModeEditeur.setAttribute("id", "bandeauNoir");
    bandeauModeEditeur.innerHTML =
        `<i class="fa-regular fa-pen-to-square icone0"></i>
    <p id="texteEdition">Mode édition</p>
    <a href="#">
        <input type="button" id="boutonPublication" value="publier les changements">
    </a>`;
    siteGlobal.insertBefore(bandeauModeEditeur, siteGlobal.firstChild);

    const contenantLoginLogout = document.getElementById("loginLogout");
    const lienLogin = document.getElementById("login");
    lienLogin.textContent = "logout";
    lienLogin.removeAttribute("class", "LoginGras");


    // Lien de modification photo de larchitecte
    const introArchi = document.getElementById("photoArchi");
    const contenantModifPhotoArchi = document.createElement("div")
    contenantModifPhotoArchi.setAttribute("id", "contenantBoutonModifierPhotoArchi");
    const iconeModifPhotoArchi = document.createElement("i");
    iconeModifPhotoArchi.classList.add("fa-regular", "fa-pen-to-square", "icone1");
    const lienModifPhotoArchi = document.createElement("a");
    lienModifPhotoArchi.setAttribute("href", "#");
    lienModifPhotoArchi.setAttribute("id", "modif1");
    lienModifPhotoArchi.textContent = "modifier";


    // Lien de modification des projets de larchitecte
    const conteneurTitreMesProjets = document.querySelector("#portfolio div");
    conteneurTitreMesProjets.setAttribute("id", "nouvellesMargesconteneurTitreMesProjets");
    const conteneurBoutonFiltre = document.querySelector(".conteneurBoutonFiltre");
    conteneurBoutonFiltre.style.display = "none";
    const iconeModifierProjets = document.createElement("i");
    iconeModifierProjets.classList.add("fa-regular", "fa-pen-to-square", "icone2");
    const lienModifierProjets = document.createElement("a");
    lienModifierProjets.setAttribute("id", "lienModifierProjets");
    lienModifierProjets.setAttribute("href", "#");
    lienModifierProjets.textContent = "modifier";


    // Lien de modification de lintroduction de larchitecte
    const introductionArchitexte = document.getElementById("presentationArchitexte");
    introductionArchitexte.setAttribute("id", "modifPresentation");

    const conteneurIntroductionArchi = document.createElement("div");
    conteneurIntroductionArchi.setAttribute("id", "conteneurIntroductionArchi");
    const iconeIntroductionArchi = document.createElement("i");
    iconeIntroductionArchi.classList.add("fa-regular", "fa-pen-to-square", "icone3");
    const lienIntroductionArchi = document.createElement("a");
    lienIntroductionArchi.setAttribute("href", "#");
    lienIntroductionArchi.textContent = "modifier";


    introArchi.appendChild(contenantModifPhotoArchi);
    contenantLoginLogout.appendChild(lienLogin);
    contenantModifPhotoArchi.appendChild(iconeModifPhotoArchi);
    contenantModifPhotoArchi.appendChild(lienModifPhotoArchi);
    conteneurTitreMesProjets.appendChild(iconeModifierProjets);
    conteneurTitreMesProjets.appendChild(lienModifierProjets);


    introductionArchitexte.insertBefore(conteneurIntroductionArchi, introductionArchitexte.firstChild);
    conteneurIntroductionArchi.appendChild(iconeIntroductionArchi);
    conteneurIntroductionArchi.appendChild(lienIntroductionArchi);


    // On revient sur la page principale au click sur logout 
    lienLogin.addEventListener("click", () => {
        sessionStorage.setItem('utilisateur', '');
        sessionStorage.setItem('token', '');
        window.location.href = "index.html";
    });


    lienModifierProjets.addEventListener("click", () => {
        creeWrappeur1();
    });
    await creeGalerie();
}


// Affiche la page de connexion de larchitecte
async function creeLeFormulaireLoginArchitecte() {

    return new Promise(async (resolve, reject) => {
        // On cache la page principale 
        document.getElementById("zonePrincipaleMain").style.display = "none";
        document.getElementById("footer").style.display = "none";

        const body = document.getElementById("body");
        const lienLoginGras = document.getElementById("login");

        lienLoginGras.setAttribute("class", "LoginGras");

        const formulaireDeConnexionArchitecte = document.createElement("aside");
        formulaireDeConnexionArchitecte.setAttribute("id", "formulaireDeConnexionArchitecte");

        const titreLogin = document.createElement('h2');
        titreLogin.setAttribute('id', 'titreLoginH2');

        const formulaire = document.createElement("form");
        formulaire.setAttribute("name", "formulaire");
        formulaire.setAttribute("id", "formulaire");
        formulaire.setAttribute("class", "form");

        const labelEmail = document.createElement('label');
        labelEmail.setAttribute('for', 'email');
        labelEmail.setAttribute('id', 'texteEmailLogIn');

        const inputEmail = document.createElement('input');
        inputEmail.setAttribute('type', 'email');
        inputEmail.setAttribute('id', 'inputMail');
        inputEmail.setAttribute("autocomplete", "on");

        const labelMotDePasse = document.createElement('label');
        labelMotDePasse.setAttribute('for', 'password');
        labelMotDePasse.setAttribute('id', 'texteMotDePasseLogIn');

        const inputMotDePasse = document.createElement('input');
        inputMotDePasse.setAttribute('type', 'password');
        inputMotDePasse.setAttribute('id', 'inputMotDePasseLogIn');
        inputMotDePasse.setAttribute("autocomplete", "off");
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

        const mentionsLegales = document.createElement("footer");
        mentionsLegales.setAttribute("id", "footerFormulaireIdentification");
        mentionsLegales.textContent = "Mentions légales";

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

        const boutonContact = document.getElementById("boutonContact");
        const boutonProjets = document.getElementById("boutonProjets");

        const valeurEmail = document.getElementById("inputMail");
        const valeurMDP = document.getElementById("inputMotDePasseLogIn");


        // On teste lexistance dun message derreur didentification, on le supprime si on clique dans un champ de saisie "email"
        valeurEmail.addEventListener("click", () => {
            if (document.getElementById("erreurMDP") != null) document.getElementById("erreurMDP").remove();
        })

        // On teste lexistance dun message derreur didentification, on le supprime si on clique dans un champ de saisie "mot de passe"
        valeurMDP.addEventListener("click", () => {
            if (document.getElementById("erreurMDP") != null) document.getElementById("erreurMDP").remove();
        })


        // Si click sur bouton contact, on fait revenir a la page dacceuil sur la section "contact"
        const afficheContact = () => {
            if (document.getElementById("formulaireDeConnexionArchitecte") != null) {
                document.getElementById("formulaireDeConnexionArchitecte").remove();
                document.getElementById("footerFormulaireIdentification").remove();
            }
            boutonContact.removeEventListener("click", afficheContact);
            boutonProjets.removeEventListener("click", afficheProjets);

            document.getElementById("zonePrincipaleMain").style.display = "block";
            document.getElementById("footer").style.display = "block";

            window.location.href = "index.html#contact";
        };


        // Si click sur le bouton projets, on fait revenir a la page dacceuil sur la section "projets"
        const afficheProjets = () => {
            if (document.getElementById("formulaireDeConnexionArchitecte") != null) {
                document.getElementById("formulaireDeConnexionArchitecte").remove();
                document.getElementById("footerFormulaireIdentification").remove();
            }
            boutonProjets.removeEventListener("click", afficheProjets);
            boutonContact.removeEventListener("click", afficheContact);

            document.getElementById("zonePrincipaleMain").style.display = "block";
            document.getElementById("footer").style.display = "block";

            window.location.href = "index.html#projets";
        };

        boutonContact.addEventListener("click", afficheContact);
        boutonProjets.addEventListener("click", afficheProjets);


        //Recuperation des identifiants tapés
        document.getElementById('boutonSeConnecterLogIn').addEventListener('click', async () => {
            const chargeUtile = {
                email: "",
                password: ""
            };

            chargeUtile.email = document.getElementById('inputMail').value;
            chargeUtile.password = document.getElementById('inputMotDePasseLogIn').value;


            await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(chargeUtile)
            })
                .then(async (reponse) => {
                    if (!reponse.ok) {
                        if ((reponse.status === 401) || (reponse.status === 404)) {
                            return;
                        };
                    }
                    else {
                        return (await reponse.json());
                    };
                })
                .then(async (data) => {
                    sessionStorage.setItem('token', data.token);
                    document.getElementById("formulaireDeConnexionArchitecte").style.display = "none";
                    document.getElementById("footerFormulaireIdentification").style.display = "none";
                    document.getElementById("zonePrincipaleMain").style.display = "block";
                    document.getElementById("footer").style.display = "block";

                    await creePageArchitecteModeEditeur();

                    // Suppression decouteurs superflus
                    boutonProjets.removeEventListener("click", afficheProjets);
                    boutonContact.removeEventListener("click", afficheContact);
                })
                .catch(async (error) => {
                    const asideLogin = document.getElementById("formulaireDeConnexionArchitecte");
                    asideLogin.remove();
                    creeLeFormulaireLoginArchitecte();
                    document.querySelector("footer#footerFormulaireIdentification").remove();

                    const messageErreur = document.getElementById("formulaireDeConnexionArchitecte");
                    errMotDePasse = document.createElement("p");
                    errMotDePasse.setAttribute("id", "erreurMDP");
                    errMotDePasse.textContent = "Erreur d'E-mail ou de mot de passe";
                    messageErreur.insertBefore(errMotDePasse, messageErreur.firstChild);
                });
        });
    });
}


// On modifie la page principale en lui ajoutant des boutons et la galerie de projets
creeBoutons();
creeGalerie();


if (sessionStorage.getItem('token') == 'null') {
    // Passage au formulaire dautentification de larchitecte
    document.getElementById("login").addEventListener("click", async () => {
        await creeLeFormulaireLoginArchitecte();


        // Passage au wrappeur1 qui permet dajouter ou de supprimer des projets
        lienModifierProjets.addEventListener("click", async () => {
            await creeWrappeur1();
        });
    });
}
else alert("Vous etes deja connecté");