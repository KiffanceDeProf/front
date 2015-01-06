front
=====

Front + UI + Logique Serveur

# Interface Utilisateur

Basé sur [cette image](https://raw.githubusercontent.com/KiffanceDeProf/front/master/web/img/base.gif).
Vue en 3D isométrique.

Plusieurs varations de bancs sont disponibles.
Les personnages fonctionnent selon la logique suivante :
- Un "squelette", choisi aléatoirement parmis n images.
- Une partie "cheveux", choisi aléatoirement parmis n images, dépendant du "squelette" donné.
- Une partie "torse", choisi aléatoirement parmis n images, dépendant du "squelette" donné.
- Une partie "jambes", choisi aléatoirement parmis n images, dépendant du "squelette" donné.
- Une partie "peau", choisi aléatoirement parmis n images (à priori je ne vois que 5 couleurs possibles : blanc, noir, chocolat, rosé, jaune).

Le jeu est actuellement réalisé en full DOM + CSS, compatible Webkit et Firefox. Pas de compatibilité IE9 ou inférieur. A réaliser en canvas dans le futur, peut-être à l'aide d'outils spécifiques pour les jeux, comme [Phaser](http://phaser.io/) par exemple.

# Logique Serveur

On entends par là toute la logique de calcul des attributs, des moyennes et des propriétés. Le tout est en Javascript. Vu que nous sommes sur du NodeJS côté serveur, le portage côté serveur devrait s'avérer assez simple.

## Logique de calcul de moyenne

_A revoir_
Chaque élève a une moyenne de base différente (aléatoire entre 0 et 19). Un bonus (ou malus, fonction du résultat) est appliqué fonction d'un ratio 1:1:1 sur les propriétés d'élèves suivants:
- Concentration
- Humeur
- Visibilité

Selon une concentration, une humeur et une visibilité de 50, le bonus de moyenne est de 0.
Si la concentration, l'humeur et la visibilité montent à 100, le bonus de moyenne obtenu est de 5.
Si la concentration, l'humeur et la visibilité descendent à 0, le bonus de moyenne obtenu est de -5.

## Logique de classes

4 classes :
- ClassRoom
- Student
- Behavior ("comportements" -> "attributs" des élèves)
- Effect

### Student

Représente un étudiant.
Contient la logique de calcul de la moyenne, les valeurs de base de concentration, d'humeur et de visibilité d'un élève.
Les variations de propriétés appliqués par les attributs des élèves sont stockés également dans cette classe.

Contient une sous-classe `StudentRandomizer` qui génère des élèves aélatoirement de manière asynchrone. Le nom des élèves est fonction du service [RandomUser](https://randomuser.me/). Peut également tirer au sort un élève "VIP" (1% de chance), à savoir des élèves dont les statistiques (moyenne de base, humeur de base, visibilité de base, concentration de base, nom, genre, prénom, etc.) sont définis dans un fichier JSON vip.json. _A terme stocker ça dans la base de données_

### ClassRoom

Représente une salle de classe.
Capable de s'auto-générer aléatoirement. Génère des élèves aléatoirement et s'aide pour se faire de la classe `StudentRandomizer`. La salle de classe peut également gérer des bancs non existants ou des bancs existants mais non occupés par un élève (10% de chances).

La salle de classe possède également la logique d'application des attributs aux élèves, et peut également calculer sa propre moyenne (moyenne de la salle de classe).

##### Logique d'application des attributs.

La logique peut-être lançée en appellant `computeBehaviors()` sur une `ClassRoom`.

```
this.places = [] // Array contenant la totalité des étudiants de la salle de classe.
this.size = { width: m, height: n } // Contient la taille de la classe. Le nombre de slots dans this.places dépends de ((size.width * 2) * size.height).
```

1. On parcours la liste `this.places` et on ressort tous les attributs de tous les étudiants dans une liste `behaviors`.
2. La liste `behaviors` contient également des informations sur la position où l'attribut se trouve et l'étudiant auquel il est rattaché
3. On trie la liste des attributs en fonction du paramètre `behavior.order`. En effet, certains attributs sont calculés en dernier, tandis que d'autres sont prioritaires.
4. Création d'une "grille de changement" (`changeGrid`) qui contient tous les changements que les attributs vont appliquer aux élèves pour les 4 propriétés : moyenne, concentration, humeur, visibilité.
5. On parcours la liste `behaviors` triée en passant la grille de changement pour chacun d'entre eux. Chaque attribut va calculer lui-même les changements qu'il opère via une méthode particulière.
6. Une fois la grille de changement calculée, on parcours la liste `this.places` pour définir les variations stockées dans la grille de changement pour chaque étudiant.
7. C'est fini !

### Behavior

Représente un attribut d'élève, un comportement.
Un attribut possède un nom et une description. L'attribut possède une méthode `computeChangeGrid(environment, changeGrid, student, position)` qui détermine comment l'attribut doit réagir par rapport à l'élève, à l'environnement (taille de la classe, élèves de la classe, etc.) et de quelle façon il change la concentration, la moyenne, l'humeur et la visibilité de la classe entière. _A terme, cette méthode utilisera la classe Effet, voir plus bas_

### Effet

_Cette classe n'existe pas encore_
Représente l'effet qu'un attribut d'élève applique et comment il l'applique.
La classe possède simplement une méthode d'implémentation pour `computeChangeGrid(environment, changeGrid, student, position)`. Nous sommes dans un environnement NodeJS (donc language interprété), il serait tout à fait possible de stocker une méthode d'implémentation dans une base de données,** afin de pouvoir changer les effets d'un attribut à chaud, sans devoir "recompiler" le programme entier.**
