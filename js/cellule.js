
class cellule
{
    /* création de l'objet cellule qui pourra recevoir les objets armes, joueurs, mur de glace */
    constructor(value = null)
    {
        this.value = value;
        this.surbrillance = false;
    }

    /* fonction qui permettra de déterminer les cases disponibles pour recevoir les surbrillances, c'est-à-dire uniquement les cases vides et armes */
    estDisponible() 
    {
        if (this.value === null) {
            return true;
        }
        if (this.value.type === 'arme') {
            return true;
        }
        if (this.value.type === 'murDeGlace') {
            return false;
        }
        if (this.value.type === 'joueur') {
            return false;
        }
    }
}