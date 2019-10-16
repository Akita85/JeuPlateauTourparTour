/* mise en place du jeu */

class jeu 
{
    constructor()
    {
        this.plateauJeu = new map(10, 40); /* initialisation de mon plateau de jeu en 10x10 */
        this.joueurActuel = joueur2;
        this.ennemi = joueur1;
        this.finDuJeu = false;
        this.modeCombat = false;
        this.tourParTour();
        this.deplacementJoueur();
       $("#attaque").click(() => {
        this.attaquer();
       });
       $("#defendre").click(() => {
        this.defendre();
       });
    }

    /* Gestion du tour par tour entre les joueurs */
    tourParTour()
    {
        if(this.joueurActuel === joueur1) {
            this.joueurActuel = joueur2;
            this.ennemi = joueur1;
            /* permet d'indiquer le nom du joueur qui doit jouer */
            $(".message1").hide(); 
            $(".message2").show();

        } else if (this.joueurActuel === joueur2) {
            this.joueurActuel = joueur1;
            this.ennemi = joueur2;
            $(".message1").show();
            $(".message2").hide();
        }
        this.genererSurbrillance();
    }

    /* Fonction permettant de tester toutes les cellules pouvant recevoir la surbrillance */
    surbrillanceCell(x, y)
    {
        if((this.plateauJeu.plateau[x] && this.plateauJeu.plateau[x][y]) && (this.plateauJeu.plateau[x][y].estDisponible())) {
            $('td#cell'+x+"-"+y).addClass('surbrillance');
            this.plateauJeu.plateau[x][y].surbrillance = true;
        } else {
            return true;
        } 
            return false;
    }

    /* Fonction permettant de déterminer la position des cellules sur lesquelles seront générés les "surbrillances".
    Cela conditionnera les déplacements possibles en fonction de la position du joueur.
    Il pourra ainsi se déplacer d’une à trois cases (horizontalement ou verticalement) avant de terminer son tour */
    surbrillance(joueurX,joueurY)
    {
        /* A la droite du joueur actuel */
        let celluleDroite = false; 
        for (let droite = 1; droite <= 3; droite++) {
            if(!celluleDroite) {
                celluleDroite = this.surbrillanceCell(joueurX, joueurY + droite);
            }
        }
        /* A la gauche du joueur actuel */
        let celluleGauche = false;
        for (let gauche = -1; gauche >= -3; gauche--) {
            if(!celluleGauche) {
            celluleGauche = this.surbrillanceCell(joueurX, joueurY + gauche);
            }
        }
        /* En dessous du joueur actuel */
        let celluleBas = false;
        for (let bas = 1; bas <= 3; bas++) {
            if(!celluleBas) {
            celluleBas = this.surbrillanceCell(joueurX+bas, joueurY);
            }
        }
        /* Au dessus du joueur actuel */
        let celluleHaut = false;
        for (let haut = -1; haut >= -3; haut--) {
            if(!celluleHaut) {
            celluleHaut = this.surbrillanceCell(joueurX+haut, joueurY);
            }
        }  
    }

    /* Génère les "surbrillances" autour du joueur en cours */
    genererSurbrillance()
    { 
        for (let x = 0; x < this.plateauJeu.nbLigne; x++) {
            for (let y = 0; y < this.plateauJeu.nbColonne; y++) {
                /* Je passe ma cellule en surbrillance à false pour commencer */
                $('td#cell'+x+"-"+y).removeClass('surbrillance');
                this.plateauJeu.plateau[x][y].surbrillance = false;
            }
        }
        if (!this.modeCombat) { /* si le joueur n'est pas en mode Combat, on génère les "surbrillances" permettant le déplacement des joueurs */
            this.surbrillance(this.joueurActuel.positionX, this.joueurActuel.positionY);
        }
    }

    /* Gestion du placement d'un joueur sur le plateau (après mouvement) */
    poserJoueur(x, y)
    {
        $('td#cell'+x+"-"+y).addClass(this.joueurActuel.cssClass);
        this.plateauJeu.plateau[this.joueurActuel.positionX][this.joueurActuel.positionY].value = null;
        $('td#cell'+this.joueurActuel.positionX+"-"+this.joueurActuel.positionY).removeClass(this.joueurActuel.cssClass);
        this.joueurActuel.positionX = x;
        this.joueurActuel.positionY = y;
        this.plateauJeu.plateau[x][y].value = this.joueurActuel;
    }

    /* quand il y a une "ancienneArme" cela permet de la laisser sur la case que le joueur vient de quitter */
    laisserAncienneArme(x, y)
    {
        if(this.joueurActuel.ancienneArme != null) { 
            $('td#cell'+x+"-"+y).removeClass().addClass(this.joueurActuel.ancienneArme.cssClass);
            this.plateauJeu.plateau[x][y].value = this.joueurActuel.ancienneArme;
            this.joueurActuel.ancienneArme = null;
        }
    }

    /* Gestion des mouvements des joueurs */
    deplacementJoueur()
    {
        for (let x = 0; x < this.plateauJeu.nbLigne; x++) {
            for (let y = 0; y < this.plateauJeu.nbColonne; y++) {
                $('td#cell'+x+"-"+y ).click(() => {
                    if (this.plateauJeu.plateau[x][y].surbrillance === true) { /* on conditionne les déplacements en fonction des "surbrillances" */
                        
                        /* Si le joueur se déplace sur une case surbrillante vide */
                        if (this.plateauJeu.plateau[x][y].value === null) {
                            /* on récupère les anciennes coordonnées du joueur, 
                            cela nous sera utile pour laisser l'ancienne arme après le départ du joueur d'une case arme */
                            let anciennePositionX = this.joueurActuel.positionX;
                            let anciennePositionY = this.joueurActuel.positionY;

                            this.poserJoueur(x, y);

                            /* si le joueur quitte une case arme */
                            this.laisserAncienneArme(anciennePositionX, anciennePositionY);
                        }  

                        /* Si le joueur se déplace sur une case surbrillante arme */
                        if((this.plateauJeu.plateau[x][y].value.type === 'arme')) {
                            let anciennePositionXBis = this.joueurActuel.positionX;
                            let anciennePositionYBis = this.joueurActuel.positionY;

                            /*on récupère l'arme de la cellule */ 
                            let armeCell = this.plateauJeu.plateau[x][y].value;

                            $('td#cell'+x+"-"+y).removeClass();
                            this.poserJoueur(x, y);
                            this.laisserAncienneArme(anciennePositionXBis, anciennePositionYBis);

                            /* Change arme : l'arme initiale que possédait le joueur devient une ancienne Arme */
                            this.joueurActuel.changementArme(armeCell);
                        }
                            this.combat(this.ennemi.positionX, this.ennemi.positionY);
                            this.tourParTour();   
                    }
                });
            }
        }
    }
    
    /* Avec l'aide de la fonction caseJoueur() on va pouvoir détecter la présence d'un adversaire sur les cases adjacentes, 
   condition permettant de débloquer les boutons attaque et défense et de passer en mode Combat ce qui annule les "surbrillances" 
   et empèche les déplacements des joueurs */
   combat(joueurX,joueurY)
   {
        if( this.plateauJeu.caseJoueur(joueurX,joueurY+1) || this.plateauJeu.caseJoueur(joueurX,joueurY-1) || this.plateauJeu.caseJoueur(joueurX+1,joueurY) || this.plateauJeu.caseJoueur(joueurX-1,joueurY) ) {
            this.modeCombat = true;
            $("#attaque").prop('disabled', false);
            $("#defendre").prop('disabled', false);
       } else {
            $("#attaque").prop('disabled', true);
            $("#defendre").prop('disabled', true);
       }
   }

    /* Gestion de l'attaque des joueurs conditionnée par le choix de l'adversaire entre attaque et défense au tour précédent */
    attaquer() 
    {
        if (this.joueurActuel.defense === true) { 
            /* si choix de l'adversaire est "défense", au tour suivant les points de dégâts qui lui seront infligés seront divisés par 2 */
            this.ennemi.changementPdv(this.ennemi.santé - this.joueurActuel.arme.dégats/2);
            this.joueurActuel.defense = false;
        } else {
            this.ennemi.changementPdv(this.ennemi.santé - this.joueurActuel.arme.dégats);
        }
        this.tourParTour();
        this.gameOver();
    }

    /* Gestion de la défense des joueurs */
    defendre() 
    {
        this.ennemi.defense = true;
        alert(this.joueurActuel.nom + " a choisi de se défendre ! Les dégats, qui lui seront infligés lors de la prochaine attaque, seront divisés par 2.");
        this.tourParTour();
        return this.ennemi.defense;
    }

    /* Fin de la partie lorsque les PDV d'un joueur <= 0 */
    gameOver() 
    {
        if (this.joueurActuel.santé <= 0) {
            this.finDuJeu = true;
            alert("Bravo, " + this.ennemi.nom + " gagne la partie ! Cliquez sur Fermer pour relancer le jeu.");
            window.location.reload(); /* remise à zéro du jeu - réinitialisation */
            }
    }
}

const jeuEnCours = new jeu();