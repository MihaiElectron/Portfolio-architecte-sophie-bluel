// # Configuration de base (URL API, headers) //

// Configuration de base de l'API
export const API_URL = 'http://localhost:5678/api';

/**
 * Fonction générique pour faire des requêtes fetch
 */
export async function fetchData(endpoint) {
    try { 
        const response = await fetch(`${API_URL}${endpoint}`);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
            /* Error (avec E majuscule) est un constructeur natif JavaScript qui crée un objet erreur.
                Cela permet de créer une erreur “réelle”, avec :
                un message (error.message)
                une pile d’appel (error.stack) qui montre où l’erreur s’est produite */
        }
        
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la requête:', error);
        throw error;
    }
}
/*  try → tente d’exécuter le code qui peut échouer (ici fetch + conversion JSON)

    throw new Error() → si la réponse n’est pas ok, on crée une erreur et on “sort” du bloc try

    catch (error) → récupère l’erreur générée (ou n’importe quelle autre erreur survenue dans try)

    console.error() → on peut logger ou afficher l’erreur pour le dev

    throw error → on “relance” l’erreur pour que la fonction appelante puisse aussi la gérer */