/* création du plateau de jeu */

class map
{
    constructor(nbLigne, nbColonne)
    {
        this.nbLigne = nbLigne;
        this.nbColonne = nbColonne;
        this.plateau = [];
        this.genererMap();
        this.mapHTML();
        this.ajoutJoueur(joueur1, nbLigne, nbColonne);
        this.ajoutJoueur(joueur2, nbLigne, nbColonne);
        this.ajoutArme(arme1, nbLigne, nbColonne);
        this.ajoutArme(arme2, nbLigne, nbColonne);
        this.ajoutArme(arme3, nbLigne, nbColonne);
        this.ajoutArme(arme4, nbLigne, nbColonne);
    }

    /* générer la grille avec cellules inaccessibles (mur de glace) réparties aléatoirement */
    genererMap()  
    {
        this.plateau = new Array();
        for (let x=0; x<this.nbLigne; x++) {
            this.plateau[x] = new Array();
            for (let y=0; y<this.nbColonne; y++) {
                this.plateau[x][y] = new cellule();
                if (Math.random()<0.1) {
                    this.plateau[x][y].value = new murDeGlace();
                }
            }
        }
    }

    /* Générer le plateau de jeu en HTML */
    mapHTML()
    {
        let monPlateau = this.plateau;
        /* création des éléments html <table> et <tbody> */
        let jeu = document.getElementById("jeu");
        let table = document.createElement("table");
        $(function() {
            $('table').addClass('table table-bordered');
        })
        let tableBody = document.createElement("tbody");

        for (let indexLigne = 0; indexLigne < this.nbLigne; indexLigne++) {
            /* création des lignes de la grille */
            let ligne = document.createElement("tr");
            ligne.id = "x"+indexLigne;
            for (let indexColonne = 0; indexColonne < this.nbColonne; indexColonne++) {
                /* création des cellules de la grille */
                let cellule = document.createElement("td");
                cellule.id = "cell"+indexLigne+"-"+indexColonne;
                if (monPlateau[indexLigne]) {
                    if ((monPlateau[indexLigne][indexColonne].value != null) && (monPlateau[indexLigne][indexColonne].value.type === "murDeGlace")){
                        $(function() {
                          $('td#cell'+indexLigne+"-"+indexColonne).addClass('murGlace');
                        })
                    } else { 
                        $(function() {
                          $('td#cell'+indexLigne+"-"+indexColonne).removeClass('murGlace');
                        })
                    }
                }
                /* une fois les noeuds créés, ici on utilise la méthode appendchild() 
                pour ajouter les noeuds enfants aux noeuds parents afin de créer notre grille qui deviendra notre plateau de jeu */

                /* on ajoute les noeuds "td" (celulles) aux noeuds parents "tr" (lignes) */
                ligne.appendChild(cellule);
                cellule.height = '60';
                cellule.width = '60';
            }
            /* on ajoute les noeuds "tr" (lignes) au noeud parent "tbody" */
            tableBody.appendChild(ligne);
        }
        table.appendChild(tableBody);
        jeu.appendChild(table);

        /* Envoi l'affichage de l'arme que possède chacun des joueurs et les dégâts qu'elle occasionne à l'instant T notamment après échange d'une arme dans le DOM, 
        de plus avec le paramètre false à déposeAncienneArme, on fait en sorte qu'à l'initialisation du jeu, le joueur n'ait pas d'ancienne Arme */
        joueur1.changementArme(joueur1.arme, false);
        joueur2.changementArme(joueur2.arme, false);

        /* Envoi l'affichage des points de vie des joueurs et l'évolution de ceux-ci dans le DOM */
        joueur1.changementPdv(joueur1.santé);
        joueur2.changementPdv(joueur2.santé);
    }

    /* fonction permettant de tester si la case existe, si elle ne contient pas d'objet et donc qu'elle est vide. 
    (utile pour l'ajout d'un joueur sur une case vide du plateau) */
    estVide (x, y) 
    {
        if (this.plateau[x] !=null && this.plateau[x][y] != null && !this.plateau[x][y].value) {
            return true;
        }
        return false; 
    }

    /* fonction permettant de récupérer un nombre aléatoire */
    valeurAleatoire(maximum)
    {
       return Math.floor(Math.random() * Math.floor(maximum));
    }

    /* fonction permettant de placer un joueur aléatoirement sur le plateau */
    ajoutJoueur(joueur, nbLigne, nbColonne) 
    {
        let ajout = false;
        let ligne = this.valeurAleatoire(nbLigne);
        let colonne = this.valeurAleatoire(nbColonne);
        while(!ajout)
        {
            /* avec cette condition on vérifie que l'on place bien le joueur sur une case vide 
            et que les deux joueurs, à l'initialisation du jeu, ne se retrouvent jamais directement sur des cases adjacentes */
            if (this.estVide(ligne, colonne) && this.estVide(ligne-1, colonne) && this.estVide(ligne+1, colonne) && this.estVide(ligne, colonne-1) && this.estVide(ligne, colonne+1)) {
                this.plateau[ligne][colonne].value = joueur;
                $('td#cell'+ligne+"-"+colonne).addClass(joueur.cssClass);
                ajout = true;
                /* on récupère les coordonnées des joueurs sur le plateau */
                joueur.positionX = ligne;
                joueur.positionY = colonne;
            } else {
                ligne = this.valeurAleatoire(nbLigne);
                colonne = this.valeurAleatoire(nbColonne);
            }
        }
    }

    /* fonction permettant de tester la présence d'un joueur sur une case,
    (sera utile pour identifier la présence d'un joueur sur une case adjacente et déterminer si on passe en mode combat (cf. jeu.js)) */
    caseJoueur(x, y) 
    {
        if (this.plateau[x] != null && this.plateau[x][y] != null && this.plateau[x][y].value != null) {
            if (this.plateau[x][y].value.type === 'joueur') {
                return true;
            }
        }
        return false;
    }

    /* fonction permettant de placer les armes aléatoirement sur le plateau */
    ajoutArme(arme, nbLigne, nbColonne)
    {
        let ajout = false;
        let ligne = this.valeurAleatoire(nbLigne);
        let colonne = this.valeurAleatoire(nbColonne);
        while(!ajout)
        {
            if (!this.plateau[ligne][colonne].value) {
                this.plateau[ligne][colonne].value = arme;
                $('td#cell'+ligne+"-"+colonne).addClass(arme.cssClass);
                ajout = true;
            } else {
                ligne = this.valeurAleatoire(nbLigne);
                colonne = this.valeurAleatoire(nbColonne);
            }
        }
    }   
}
