Explication et résumé de la structure du projet, ce que chaque répertoire contient et le fonctionnement du serveur.

Architecture:
- Patron de conception MVC.

Structure du projet:
-config
    Contient tout les fichiers de configurations du systême (bd, connexion, config global, logger,...)
    Ce sont les fichiers qui peuvent être changer dépendament si en mode production ou dévellopement
-controllers
    Contient la logique du site web page par page, autrement appellé routes
    C'est là que ce déroule le routing du service web
-helper
    Les class qui aide à faire le travail
-models
    Le passage de l'application au serveur et vice versa se fait nécessairement par les fichiers dans ce dossier
    les fichiers ici gèrent le I/O de la bd
-node_modules
    Ce dossier contient tout les librairies utilisés par le projet
-public:
    Ce dossier contient les fichiers utilisés par le site web, tel que css, images et librairies javascript
    le site web a accès à tout ce qui est dans /public comme si /public était le répertoire courant de la page web courante
        (cela est fait dans server.js)
-tests:
    Contient tout ce qui concerne les tests (test unitaire, ...)
-views:
    Contient tout les fichiers ejs (qui est un template de javascript pour faire du html). Il contient 3 types de dossier
    1-Les langues (fr, en): Ce sont des fichiers ejs  qui contienne tout les strings pour l'affichage. Facilite le
        changement de langage.
    2-Page: Ce sont les pages ejs complètes et indépendantes. Ce sont donc les pages principales.
    3-Partials: Ce sont les pages dépendantes et qui doivent être utilisés soit dans une page ou un autre partials
-package.json:
    Contient les informations importantes sur l'application et ses dépendances. Ajouter tout les librairies dans ce fichier
    afin de pouvoir tout ajouter en une ligne (terminal --> npm install)
-server.js:
    Initialise l'application et ses configurations. C'est dans ce fichier que démarre l'application.

méthodes HTTP: (utile pour comprendre routes.js)
    get
        pour obtenir une ressource. ceci est idempotent(peut importe le nombre d'appels, la réponse et le serveur ne changent pas)
    post
        pour insérer
    put
        pour mettre à jour
    delete
        pour supprimer