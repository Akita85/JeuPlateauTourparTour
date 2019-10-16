
class arme 
{
	/* création de l'objet arme */
    constructor(nom, dégats, cssClass, imgUrl) 
    {
    	this.type = 'arme'; /* permet d'avoir un élément commun entre les armes lors de la gestion des conditions */
        this.nom = nom;
        this.dégats = dégats;
        this.cssClass = cssClass;
        this.imgUrl = imgUrl;
    }
}

/* création des 4 armes */
let arme1 = new arme ("grandGriffe", 10, 'arme1','<img src="img/arme/grandGriffe.png" alt="grandGriffe" width="20%"></img>');
let arme2 = new arme ("dagueVerreDragon", 40, 'arme2', '<img src="img/arme/dagueVerreDragon.png" alt="dagueVerreDragon" width="30%"></img>');
let arme3 = new arme ("drogon", 60, 'arme3', '<img src="img/arme/drogon.png" alt="drogon" width="30%"></img>');
let arme4 = new arme ("lameGlace", 10, 'arme4', '<img src="img/arme/lameGlace.png" alt="lameGlace" width="20%"></img>');