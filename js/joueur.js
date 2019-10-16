
class joueur 
{
    /* création de l'objet Joueur */
    constructor(nom, santé, arme, cssClass) 
    {
        this.type = 'joueur'; /* permet d'avoir un élément commun entre les joueurs lors de la gestion des conditions */
        this.nom = nom;
        this.santé = santé;
        this.arme = arme;
        this.ancienneArme = null;
        this.defense = false;
        this.cssClass = cssClass;
        this.positionX = null;
        this.positionY = null;
    }

    /* gestion de l'échange des armes et affichage en HTML*/
    /* ajout d'un argument évitant ainsi que lors de l'initialisation du jeu, 
    l'arme par défaut soit mise également en ancienneArme */
    changementArme(arme, deposeAncienneArme = true) 
    
    {
        if (deposeAncienneArme) { 
            this.ancienneArme = this.arme;
        }
        
        this.arme = arme;
        let armeID = "#arme_" + this.cssClass; 
        let degatsID = "#degats_" + this.cssClass;
        $(armeID).html(arme.imgUrl);
        $(degatsID).html(arme.dégats);
    }

    /* gestion des points de vie/santé et affichage en HTML*/
    changementPdv(nombre)
    {
        this.santé = nombre;
        let pvID = "#pdv_" + this.cssClass;
        $(pvID).html(nombre);
    }  
}


/* créations des 2 joueurs */
let joueur1 = new joueur("Jon Snow", 100,  arme1, 'joueur1');
let joueur2 = new joueur("Roi de la Nuit", 100, arme4, 'joueur2');
