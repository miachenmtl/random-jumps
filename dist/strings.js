const strings = {
  langCode: {
    en: "EN",
    fr: "FR"
  },
  OTHER_LANG: {
    en: "Français",
    fr: "English"
  },
  OTHER_LANG_CODE: {
    en: "fr",
    fr: "en"
  },
  TITLE: {
    en: "Random Knight Jumps",
    fr: "Marche Aléatoire du Cavalier"
  },
  START: {
    en: "Start",
    fr: "Marche"
  },
  STOP: {
    en: "Stop",
    fr: "Arrêt"
  },
  RESET: {
    en: "Reset",
    fr: "Réinitialiser"
  },
  SETTINGS: {
    en: "Settings",
    fr: "Paramètres"
  },
  SPEED: {
    en: "Speed",
    fr: "Vitesse"
  },
  SPEED_NAMES: [{
    en: "Walk",
    fr: "Pas"
  }, {
    en: "Trot",
    fr: "Trot"
  }, {
    en: "Canter",
    fr: "Petit galop"
  }, {
    en: "Gallop",
    fr: "Galop"
  }, {
    en: "Jet",
    fr: "Turboréacteur"
  }, {
    en: "Warp",
    fr: "Supraluminique"
  }],
  SHOW: {
    en: "Show",
    fr: "Afficher"
  },
  KNIGHT: {
    en: "Knight",
    fr: "Cavalier"
  },
  COUNT: {
    en: "Count",
    fr: "Compte"
  },
  PERCENT_MAX: {
    en: "% of max",
    fr: "% de la valeur max"
  },
  HEATMAP: {
    en: "Heatmap",
    fr: "Carte de chaleur"
  },
  HIGHLIGHT: {
    en: "Highlight",
    fr: "Surlignage"
  },
  BOARD: {
    en: "Board",
    fr: "Échiquier"
  },
  RANKS: {
    en: "Ranks",
    fr: "Rangées"
  },
  FILES: {
    en: "Files",
    fr: "Colonnes"
  },
  NEW_BOARD: {
    en: "New Board",
    fr: "Nouvel Échiquier"
  },
  MODE: {
    en: "Mode",
    fr: "Mode"
  },
  AUTOMATIC: {
    en: "Automatic",
    fr: "Automatique"
  },
  MANUAL: {
    en: "Manual",
    fr: "Manuel"
  },
  STATS: {
    en: "Stats for nerds",
    fr: "Statistiques"
  },
  TRIP_COUNT: {
    en: "Completed trips:",
    fr: "Voyages terminés:"
  },
  MOVE_COUNTS: {
    en: "Moves per trip:",
    fr: "Coups par voyage:"
  },
  AVERAGE: {
    en: "Average:",
    fr: "Moyen:"
  },
  TOTAL_MOVES: {
    en: "Total moves:",
    fr: "Nombre de coups:"
  },
  COPY: {
    en: "Copy",
    fr: "Copier"
  },
  COPY_MSG: {
    en: "Formatted as single column",
    fr: "En forme d'une seule colonne"
  },
  COPY_BOARD: {
    en: "Copy board as CSV",
    fr: "Copier l'échiquier au format CSV"
  },
  COPIED: {
    en: "Copied!",
    fr: "Copié!"
  },
  TO_INITIAL: {
    en: "To initial square",
    fr: "À la case initiale"
  },
  TO_ALL: {
    en: "To all squares",
    fr: "À toutes les cases"
  }
};
Object.keys(strings).forEach(key => {
  strings[key].empty = "";
});
export default strings;