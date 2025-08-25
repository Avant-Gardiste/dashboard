import React, { useState, useEffect } from 'react';
import { Plus, Download, Trash2, Users, FileText, LogOut, RefreshCw, X, Trash, UserPlus, Search, Settings, Eye, EyeOff, Key, Scissors, User, Euro, CreditCard, Gift, Clock, BarChart3 } from 'lucide-react';

// Composant séparé pour la gestion des comptes
const AccountManager = ({ onBack }) => {
  const [accounts, setAccounts] = useState({});
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = () => {
    const savedAccounts = JSON.parse(localStorage.getItem('salon_accounts') || '{}');
    setAccounts(savedAccounts);
  };

  const deleteAccount = (username) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le compte "${username}" ?\n\nCette action supprimera :\n- Le compte utilisateur\n- Toutes les données associées (coiffeurs, prestations)\n\nCette action est IRRÉVERSIBLE !`)) {
      const updatedAccounts = { ...accounts };
      delete updatedAccounts[username];
      
      // Supprimer le compte
      localStorage.setItem('salon_accounts', JSON.stringify(updatedAccounts));
      
      // Supprimer les données associées
      localStorage.removeItem(`salon_data_${username}`);
      
      // Si c'est l'utilisateur actuellement connecté, le déconnecter
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser && currentUser.username === username) {
        localStorage.removeItem('currentUser');
        window.location.reload();
      }
      
      setAccounts(updatedAccounts);
      alert(`✅ Compte "${username}" supprimé avec succès !`);
    }
  };

  const resetAllAccounts = () => {
    if (window.confirm('⚠️ ATTENTION ! ⚠️\n\nCette action va supprimer TOUS les comptes et TOUTES les données !\n\nÊtes-vous absolument sûr de vouloir continuer ?\n\nTous les salons, coiffeurs et prestations seront perdus définitivement !')) {
      if (window.confirm('DERNIÈRE CONFIRMATION !\n\nTapez "SUPPRIMER TOUT" dans votre tête et cliquez sur OK pour confirmer la suppression complète.')) {
        // Supprimer tous les comptes
        localStorage.removeItem('salon_accounts');
        
        // Supprimer toutes les données utilisateur
        Object.keys(accounts).forEach(username => {
          localStorage.removeItem(`salon_data_${username}`);
        });
        
        // Déconnecter l'utilisateur actuel
        localStorage.removeItem('currentUser');
        
        alert('💥 Tous les comptes ont été supprimés !\n\nRetour à la page de connexion...');
        window.location.reload();
      }
    }
  };

  const exportAccountData = (username) => {
    try {
      const userKey = `salon_data_${username}`;
      const userData = JSON.parse(localStorage.getItem(userKey) || '{}');
      const account = accounts[username];
      
      const exportData = {
        account: {
          username: username,
          salonName: account.salonName,
          createdAt: account.createdAt
        },
        data: userData,
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json;charset=utf-8;' 
      });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `salon_backup_${username}_${new Date().toISOString().split('T')[0]}.json`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert(`✅ Données de "${username}" exportées !`);
    } catch (error) {
      alert('❌ Erreur lors de l\'exportation');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                <Settings className="inline w-8 h-8 mr-2" />
                Gestion des Comptes
              </h1>
              <p className="text-gray-600">Administration des comptes salon</p>
            </div>
            <button
              onClick={onBack}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              ← Retour
            </button>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Comptes enregistrés ({Object.keys(accounts).length})
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="flex items-center bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 text-sm"
                >
                  {showPasswords ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                  {showPasswords ? 'Masquer' : 'Voir'} MDP
                </button>
                <button
                  onClick={resetAllAccounts}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
                  disabled={Object.keys(accounts).length === 0}
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Tout supprimer
                </button>
              </div>
            </div>

            {Object.keys(accounts).length === 0 ? (
              <div className="bg-gray-100 p-8 rounded-lg text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Aucun compte enregistré</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(accounts).map(([username, accountData]) => (
                  <div key={username} className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{accountData.salonName}</h3>
                            <p className="text-gray-600">@{username}</p>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-500 space-y-1">
                          <div className="flex items-center">
                            <Key className="w-4 h-4 mr-2" />
                            <span>Mot de passe: </span>
                            <span className="font-mono bg-gray-200 px-2 py-1 rounded">
                              {showPasswords ? accountData.password : '••••••••'}
                            </span>
                          </div>
                          <div>📅 Créé le: {new Date(accountData.createdAt).toLocaleDateString('fr-FR')}</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => exportAccountData(username)}
                          className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 text-sm"
                          title="Exporter les données"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteAccount(username)}
                          className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 text-sm"
                          title="Supprimer le compte"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-yellow-100 border border-yellow-300 p-4 rounded-lg">
            <h3 className="font-bold text-yellow-800 mb-2">⚠️ Informations importantes</h3>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• Les données sont stockées localement dans votre navigateur</li>
              <li>• La suppression d'un compte est définitive</li>
              <li>• Exportez régulièrement vos données importantes</li>
              <li>• Vider le cache du navigateur supprimera tous les comptes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant séparé pour la page de connexion
const LoginPage = ({ onLogin }) => {
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [showAccountManager, setShowAccountManager] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [createAccountData, setCreateAccountData] = useState({ 
    username: '', 
    password: '', 
    confirmPassword: '',
    salonName: '' 
  });

  // Fonctions pour gérer les comptes
  const saveAccount = (accountData) => {
    const accounts = JSON.parse(localStorage.getItem('salon_accounts') || '{}');
    accounts[accountData.username] = {
      password: accountData.password,
      salonName: accountData.salonName,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('salon_accounts', JSON.stringify(accounts));
  };

  const getAccount = (username) => {
    const accounts = JSON.parse(localStorage.getItem('salon_accounts') || '{}');
    return accounts[username] || null;
  };

  const validateLogin = (username, password) => {
    const account = getAccount(username);
    return account && account.password === password ? account : null;
  };

  const handleLogin = () => {
    if (loginData.username && loginData.password) {
      const account = validateLogin(loginData.username, loginData.password);
      if (account) {
        const user = {
          username: loginData.username,
          salonName: account.salonName
        };
        onLogin(user);
      } else {
        alert('Nom d\'utilisateur ou mot de passe incorrect');
      }
    } else {
      alert('Veuillez remplir tous les champs');
    }
  };

  const handleCreateAccount = () => {
    const { username, password, confirmPassword, salonName } = createAccountData;
    
    if (!username || !password || !confirmPassword || !salonName) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    
    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (password.length < 4) {
      alert('Le mot de passe doit contenir au moins 4 caractères');
      return;
    }
    
    if (getAccount(username)) {
      alert('Ce nom d\'utilisateur existe déjà');
      return;
    }
    
    // Créer le compte
    saveAccount(createAccountData);
    
    // Se connecter automatiquement
    const user = {
      username: username,
      salonName: salonName
    };
    onLogin(user);
    
    // Reset des formulaires
    setCreateAccountData({ username: '', password: '', confirmPassword: '', salonName: '' });
    setShowCreateAccount(false);
    
    alert(`Compte créé avec succès ! Bienvenue ${salonName} !`);
  };

  if (showAccountManager) {
    return <AccountManager onBack={() => setShowAccountManager(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Salon de Coiffure</h1>
          <p className="text-gray-600">
            {showCreateAccount ? 'Créer un nouveau compte' : 'Connexion au système de gestion'}
          </p>
        </div>
        
        {!showCreateAccount ? (
          // Formulaire de connexion
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Entrez votre nom d'utilisateur"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Entrez votre mot de passe"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Se connecter
            </button>
            
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => setShowCreateAccount(true)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Pas encore de compte ? Créer un compte
              </button>
              
              <button
                onClick={() => setShowAccountManager(true)}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center justify-center"
              >
                <Settings className="w-4 h-4 mr-2" />
                Gérer les comptes
              </button>
            </div>
            
            <div className="text-center text-sm text-gray-500">
              Application de gestion pour salon de coiffure
            </div>
          </div>
        ) : (
          // Formulaire de création de compte
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du salon
              </label>
              <input
                type="text"
                value={createAccountData.salonName}
                onChange={(e) => setCreateAccountData({...createAccountData, salonName: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="Ex: Salon Belle Coupe"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                value={createAccountData.username}
                onChange={(e) => setCreateAccountData({...createAccountData, username: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="Choisissez un nom d'utilisateur"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={createAccountData.password}
                onChange={(e) => setCreateAccountData({...createAccountData, password: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="Minimum 4 caractères"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                value={createAccountData.confirmPassword}
                onChange={(e) => setCreateAccountData({...createAccountData, confirmPassword: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="Confirmez votre mot de passe"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateAccount()}
              />
            </div>
            
            <button
              onClick={handleCreateAccount}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Créer le compte
            </button>
            
            <div className="text-center">
              <button
                onClick={() => setShowCreateAccount(false)}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                ← Retour à la connexion
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Composant principal de l'application salon
const SalonApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // États avec chargement depuis une simulation de localStorage
  const [coiffeurs, setCoiffeurs] = useState([]);
  const [prestations, setPrestations] = useState([]);
  
  const [nouveauCoiffeur, setNouveauCoiffeur] = useState('');
  const [montrerAjoutCoiffeur, setMontrerAjoutCoiffeur] = useState(false);
  
  // État pour la prestation en cours - AJOUT DU POURBOIRE
  const [prestationActuelle, setPrestationActuelle] = useState({
      coiffeur: '',
      prix: '',
      pourboire: '0', // NOUVEAU: valeur par défaut à 0
      paiement: '',
      prestation: ''
    });

  // États pour la recherche de prestations
  const [recherchePrestation, setRecherchePrestation] = useState('');
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const [categorieSelectionnee, setCategorieSelectionnee] = useState('homme');

  // Prestations prédéfinies
  const prestationsPredefinis = {
    homme: [
      'Coupe Simple',
      'Barbe',
      'Coupe + Barbe',
      'Coupe + Shampoing + Coiffage',
      'Lissage Brésilien',
      'Mèche'
    ],
    femme: [
      'Shampoing + Coupe + Brushing',
      'Brushing',
      'Coloration Complète',
      'Permanente (à partir de ...)',
      'Coloration Complète + Shampoing + Brushing',
      'Mèche + Balayage + Brushing',
      'Coloration Racines (30gr)',
      'Mèches / Balayage partiel',
      'Mèches / Balayage complet',
      'Ombré Haire / Tie & Die',
      'Patine / Gloss',
      'Lissage Brésilien',
      'Forfait Mariée',
      'Coiffure de soirée',
      'Soin Profond + Massage',
      'Soin Botox Capillaire',
      'Soin Express'

    ],
    enfant: [
      'Coupe -12 ans',
      'Coupe 12 à 16 ans'
    ]
  };

  // Charger les données au démarrage
  useEffect(() => {
    if (!dataLoaded) {
      // Vérifier si l'utilisateur était connecté
      const savedUser = JSON.parse(localStorage.getItem("currentUser")) || null;
      if (savedUser) {
        handleLogin(savedUser);
      }
      setDataLoaded(true);
    }
  }, [dataLoaded]);

  // Sauvegarder automatiquement dans le storage global
  useEffect(() => {
    if (dataLoaded && currentUser) {
      const userKey = `salon_data_${currentUser.username}`;
      const userData = {
        coiffeurs,
        prestations,
        lastUpdate: new Date().toISOString()
      };
      localStorage.setItem(userKey, JSON.stringify(userData));
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }
  }, [coiffeurs, prestations, currentUser, dataLoaded]);

  // Fonction de connexion
  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    
    // Charger les données de cet utilisateur
    const userKey = `salon_data_${user.username}`;
    const savedData = JSON.parse(localStorage.getItem(userKey) || '{}');
    setCoiffeurs(savedData.coiffeurs || []);
    setPrestations(savedData.prestations || []);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCoiffeurs([]);
    setPrestations([]);
    localStorage.removeItem("currentUser");
  };

  // Calcul du total journalier (SANS pourboires pour le dashboard)
  const totalJournee = prestations.reduce((total, p) => total + parseFloat(p.prix || 0), 0);
  const totalLiquide = prestations.filter(p => p.paiement === 'liquide').reduce((total, p) => total + parseFloat(p.prix || 0), 0);
  const totalCarte = prestations.filter(p => p.paiement === 'carte').reduce((total, p) => total + parseFloat(p.prix || 0), 0);

  // NOUVEAU: Calculs pour les pourboires (pour les rapports)
  const totalPourboires = prestations.reduce((total, p) => total + parseFloat(p.pourboire || 0), 0);
  const totalAvecPourboires = totalJournee + totalPourboires;

  // Statistiques par coiffeur
  const statsCoiffeurs = coiffeurs.map(coiffeur => {
    const prestationsCoiffeur = prestations.filter(p => p.coiffeur === coiffeur);
    const total = prestationsCoiffeur.reduce((sum, p) => sum + parseFloat(p.prix || 0), 0);
    const pourboires = prestationsCoiffeur.reduce((sum, p) => sum + parseFloat(p.pourboire || 0), 0);
    return {
      nom: coiffeur,
      nbPrestations: prestationsCoiffeur.length,
      total: total,
      pourboires: pourboires,
      totalAvecPourboires: total + pourboires
    };
  }).filter(stat => stat.nbPrestations > 0);

  // Prix prédéfinis pour faciliter la saisie
  const prixPredéfinis = [10, 15, 20, 25, 35, 50, 70, 90];
  // NOUVEAU: Pourboires prédéfinis
  const pourboiresPredéfinis = [0, 2, 5, 10, 15, 20];

  // Fonction pour filtrer les prestations selon la recherche
  const filtrerPrestations = (recherche) => {
    if (!recherche) return prestationsPredefinis[categorieSelectionnee];
    
    return prestationsPredefinis[categorieSelectionnee].filter(prestation =>
      prestation.toLowerCase().includes(recherche.toLowerCase())
    );
  };

  // Fonction pour sélectionner une prestation
  const selectionnerPrestation = (prestation) => {
    setPrestationActuelle(prev => ({ ...prev, prestation }));
    setRecherchePrestation('');
    setSuggestionsVisible(false);
  };

  // Fonction d'actualisation MODIFIÉE - Ne touche PAS aux coiffeurs
  const actualiserDonnees = () => {
    if (prestations.length > 0) {
      // Télécharger avant d'actualiser
      telechargerExcel();
      
      // Petit délai pour permettre le téléchargement
      setTimeout(() => {
        if (window.confirm('Voulez-vous vraiment actualiser les données ? Seules les prestations seront effacées.\n\n⚠️ Les coiffeurs seront conservés.')) {
          // SEULEMENT actualiser les prestations, PAS les coiffeurs
          setPrestations([]);
          setPrestationActuelle({ coiffeur: '', prix: '', pourboire: '0', paiement: '', prestation: '' });
          
          alert('✅ Prestations actualisées et fichier téléchargé !\n\n👥 Les coiffeurs ont été conservés.');
        }
      }, 500);
    } else {
      if (window.confirm('Aucune prestation à sauvegarder. Actualiser quand même ?')) {
        setPrestations([]);
        setPrestationActuelle({ coiffeur: '', prix: '', pourboire: '0', paiement: '', prestation: '' });
        
        alert('✅ Prestations actualisées !\n\n👥 Les coiffeurs ont été conservés.');
      }
    }
  };

  const ajouterCoiffeur = () => {
    if (nouveauCoiffeur.trim()) {
      const nouveauxCoiffeurs = [...coiffeurs, nouveauCoiffeur.trim()];
      setCoiffeurs(nouveauxCoiffeurs);
      setNouveauCoiffeur('');
      setMontrerAjoutCoiffeur(false);
    }
  };

  const supprimerCoiffeur = (coiffeurASupprimer) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${coiffeurASupprimer}" ? Cette action est irréversible.`)) {
      // Supprimer le coiffeur de la liste
      const nouveauxCoiffeurs = coiffeurs.filter(c => c !== coiffeurASupprimer);
      setCoiffeurs(nouveauxCoiffeurs);
      
      // Si c'est le coiffeur sélectionné actuellement, le désélectionner
      if (prestationActuelle.coiffeur === coiffeurASupprimer) {
        setPrestationActuelle({...prestationActuelle, coiffeur: ''});
      }
    }
  };

  const annulerAjoutCoiffeur = () => {
    setMontrerAjoutCoiffeur(false);
    setNouveauCoiffeur('');
  };

  const ajouterPrestation = () => {
    if (prestationActuelle.coiffeur && prestationActuelle.prix && prestationActuelle.paiement) {
      const maintenant = new Date();
      const prestation = {
        ...prestationActuelle,
        heure: maintenant.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        timestamp: maintenant.toISOString()
      };
      
      setPrestations([...prestations, prestation]);
      setPrestationActuelle({ coiffeur: '', prix: '', pourboire: '0', paiement: '', prestation: '' });
    }
  };

  // NOUVEAU : Fonction pour valider la saisie du prix
  const validerSaisiePrix = () => {
    if (prestationActuelle.prix && prestationActuelle.prix.trim() !== '') {
      // Si tous les champs sont remplis, ajouter directement la prestation
      if (prestationActuelle.coiffeur && prestationActuelle.paiement) {
        ajouterPrestation();
      }
      // Sinon, juste valider le prix (garder le focus sur les autres champs)
    }
  };

  const supprimerPrestation = (index) => {
    setPrestations(prestations.filter((_, i) => i !== index));
  };

  // Fonction pour générer le contenu CSV (compatible Excel) - MODIFIÉ POUR POURBOIRES
  const genererCSV = () => {
    const headers = ['N°', 'Heure', 'Coiffeur', 'Prestation' , 'Prix (€)', 'Pourboire (€)', 'Total (€)', 'Mode de paiement'];
    
    let csvContent = '\uFEFF'; // BOM pour UTF-8
    csvContent += `${currentUser?.salonName || 'SALON DE COIFFURE'} - RAPPORT JOURNALIER\n`;
    csvContent += `Date: ${new Date().toLocaleDateString('fr-FR')}\n`;
    csvContent += `\n`;
    csvContent += headers.join(';') + '\n';
    
    prestations.forEach((prestation, index) => {
      const prix = parseFloat(prestation.prix);
      const pourboire = parseFloat(prestation.pourboire || 0);
      const total = prix + pourboire;
      
      const row = [
        index + 1,
        prestation.heure,
        prestation.coiffeur,
        prestation.prestation || 'Non spécifiée',
        prix.toFixed(2),
        pourboire.toFixed(2),
        total.toFixed(2),
        prestation.paiement === 'liquide' ? 'Liquide' : 'Carte'
      ];
      csvContent += row.join(';') + '\n';
    });
    
    // Ajouter les totaux - MODIFIÉ POUR POURBOIRES
    csvContent += '\n';
    csvContent += 'RÉSUMÉ DE LA JOURNÉE\n';
    csvContent += `Total prestations;${prestations.length}\n`;
    csvContent += `Chiffre d'affaires (prestations);${totalJournee.toFixed(2)}€\n`;
    csvContent += `Total pourboires;${totalPourboires.toFixed(2)}€\n`;
    csvContent += `TOTAL GÉNÉRAL;${totalAvecPourboires.toFixed(2)}€\n`;
    csvContent += `Paiement Liquide;${totalLiquide.toFixed(2)}€\n`;
    csvContent += `Paiement Carte;${totalCarte.toFixed(2)}€\n`;
    
    // Détail par coiffeur - MODIFIÉ POUR POURBOIRES
    if (statsCoiffeurs.length > 0) {
      csvContent += '\n';
      csvContent += 'DÉTAIL PAR COIFFEUR\n';
      csvContent += 'Nom;Prestations;Prestations (€);Pourboires (€);Total (€)\n';
      statsCoiffeurs.forEach(stat => {
        csvContent += `${stat.nom};${stat.nbPrestations};${stat.total.toFixed(2)};${stat.pourboires.toFixed(2)};${stat.totalAvecPourboires.toFixed(2)}\n`;
      });
    }
    
    return csvContent;
  };

  const telechargerExcel = () => {
    try {
      const csvContent = genererCSV();
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${currentUser?.salonName || 'Salon'}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setTimeout(() => {
          setCoiffeurs([...coiffeurs]);
          setPrestations([...prestations]);
          
          alert(`✅ Fichier téléchargé avec succès!\n\n📁 ${prestations.length} prestations exportées\n💰 Total: ${totalJournee.toFixed(2)}€\n🎁 Pourboires: ${totalPourboires.toFixed(2)}€\n💎 Total général: ${totalAvecPourboires.toFixed(2)}€\n\n📊 Les données ont été actualisées`);
        }, 100);
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('❌ Erreur lors du téléchargement du fichier');
    }
  };

  const RapportExcel = () => (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-lg">
      <div className="bg-green-800 text-white p-4 text-center font-bold text-lg">
        <FileText className="inline w-6 h-6 mr-2" />
        {currentUser?.salonName || 'SALON DE COIFFURE'} - RAPPORT JOURNALIER
      </div>
      <div className="bg-green-100 p-3 text-center font-bold text-green-800">
        📁 Fichier: {currentUser?.salonName || 'Salon'}_{new Date().toISOString().split('T')[0]}.csv
      </div>
      
      {prestations.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-3 text-left">N°</th>
                  <th className="p-3 text-left"><Clock className="inline w-4 h-4 mr-1" />Heure</th>
                  <th className="p-3 text-left"><User className="inline w-4 h-4 mr-1" />Coiffeur</th>
                  <th className="p-3 text-left"><Scissors className="inline w-4 h-4 mr-1" />Prestation</th>
                  <th className="p-3 text-left"><Euro className="inline w-4 h-4 mr-1" />Prix (€)</th>
                  <th className="p-3 text-left"><Gift className="inline w-4 h-4 mr-1" />Pourboire (€)</th>
                  <th className="p-3 text-left"><BarChart3 className="inline w-4 h-4 mr-1" />Total (€)</th>
                  <th className="p-3 text-left"><CreditCard className="inline w-4 h-4 mr-1" />Paiement</th>
                </tr>
              </thead>
              <tbody>
                {prestations.map((prestation, index) => {
                  const prix = parseFloat(prestation.prix);
                  const pourboire = parseFloat(prestation.pourboire || 0);
                  const total = prix + pourboire;
                  
                  return (
                    <tr key={index} className={index % 2 === 1 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{prestation.heure}</td>
                      <td className="p-3">{prestation.coiffeur}</td>
                      <td className="p-3">{prestation.prestation}</td>
                      <td className="p-3">{prix.toFixed(2)}</td>
                      <td className="p-3">
                        {pourboire > 0 ? (
                          <span className="text-green-600 font-medium">+{pourboire.toFixed(2)}</span>
                        ) : (
                          <span className="text-gray-400">0.00</span>
                        )}
                      </td>
                      <td className="p-3 font-bold text-blue-600">{total.toFixed(2)}</td>
                      <td className="p-3">
                        <span className={`font-bold ${
                          prestation.paiement === 'liquide' 
                            ? 'text-orange-600' 
                            : 'text-blue-600'
                        }`}>
                          {prestation.paiement === 'liquide' ? 'Liquide' : 'Carte'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="bg-gray-100 p-4">
            <h3 className="font-bold text-lg mb-3">
              <BarChart3 className="inline w-5 h-5 mr-2" />
              RÉSUMÉ DE LA JOURNÉE
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              <div className="bg-white p-3 rounded border">
                <div className="font-bold text-sm">🔢 Total prestations</div>
                <div className="text-xl text-blue-600">{prestations.length}</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-bold text-sm">💰 Prestations</div>
                <div className="text-xl text-green-600">{totalJournee.toFixed(2)} €</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-bold text-sm">🎁 Pourboires</div>
                <div className="text-xl text-purple-600">{totalPourboires.toFixed(2)} €</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="font-bold text-sm">💎 TOTAL GÉNÉRAL</div>
                <div className="text-xl text-indigo-600 font-bold">{totalAvecPourboires.toFixed(2)} €</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="grid grid-cols-1 gap-1">
                  <div className="text-xs">
                    <span className="font-bold text-orange-600">💵 {totalLiquide.toFixed(2)}€</span>
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-blue-600">💳 {totalCarte.toFixed(2)}€</span>
                  </div>
                </div>
              </div>
            </div>
            
            {statsCoiffeurs.length > 0 && (
              <>
                <h4 className="font-bold mb-2">
                  <Users className="inline w-4 h-4 mr-1" />
                  DÉTAIL PAR COIFFEUR:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {statsCoiffeurs.map((stat, index) => (
                    <div key={index} className="bg-white p-3 rounded border">
                      <div className="font-bold">{stat.nom}</div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>🔢 {stat.nbPrestations} prestations</div>
                        <div>💰 Prestations: {stat.total.toFixed(2)} €</div>
                        <div>🎁 Pourboires: {stat.pourboires.toFixed(2)} €</div>
                        <div className="font-bold text-indigo-600">💎 Total: {stat.totalAvecPourboires.toFixed(2)} €</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="p-8 text-center text-gray-500">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p>Aucune prestation enregistrée pour aujourd'hui</p>
        </div>
      )}
    </div>
  );

  if (!dataLoaded) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
      }}>
        <div style={{
          border: "4px solid rgba(0, 0, 0, 0.1)",
          borderLeftColor: "#4f46e5", // violet
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          animation: "spin 1s linear infinite"
        }}></div>
        <style>
          {`@keyframes spin { to { transform: rotate(360deg); } }`}
        </style>
      </div>
    );
  }

  // Si pas connecté, afficher la page de connexion
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }
  
  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50 min-h-screen">
      {/* En-tête avec boutons de contrôle */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-blue-600 mb-2 flex items-center">
              <Scissors className="w-6 h-6 mr-2" />
              {currentUser?.salonName || 'Salon de Coiffure'} - Suivi Journalier
            </h1>
            <p className="text-gray-600">
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-sm text-gray-500">
              Connecté en tant que: {currentUser?.username}
            </p>
          </div>
          
          <div className="flex gap-1 flex-col sm:flex-row">
            <button
              onClick={actualiserDonnees}
              className="bg-orange-600 text-white px-2 sm:px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center transition-colors text-sm sm:text-base"
              title="Actualiser les prestations (garde les coiffeurs)"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-2 sm:px-4 py-2 rounded-lg hover:bg-red-700 flex items-center transition-colors text-sm sm:text-base"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </button>
          </div>
        </div>
        
        {/* Totaux du jour - GARDE LES MÊMES (sans pourboires) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-green-100 p-4 rounded-lg text-center">
            <div className="text-lg sm:text-2xl font-bold text-green-800">{totalJournee.toFixed(2)}€</div>
            <div className="text-green-600">Total Journée</div>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg text-center">
            <div className="text-base sm:text-xl font-bold text-blue-800">{totalLiquide.toFixed(2)}€</div>
            <div className="text-blue-600">Liquide</div>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg text-center">
            <div className="text-xl font-bold text-purple-800">{totalCarte.toFixed(2)}€</div>
            <div className="text-purple-600">Carte</div>
          </div>
        </div>
      </div>

      {/* Formulaire de saisie */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Plus className="mr-2" />
          Nouvelle Prestation
        </h2>
        
        {/* Gestion des coiffeurs */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 flex items-center">
            <Users className="w-4 h-4 mr-1" />
            Coiffeurs
          </label>
          
          {/* Liste des coiffeurs existants */}
          {coiffeurs.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-3">
              {coiffeurs.map((coiffeur) => (
                <div key={coiffeur} className="flex items-center">
                  <button
                    onClick={() => setPrestationActuelle({...prestationActuelle, coiffeur})}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      prestationActuelle.coiffeur === coiffeur
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } transition-colors`}
                  >
                    {coiffeur}
                  </button>
                  <button
                    onClick={() => supprimerCoiffeur(coiffeur)}
                    className="ml-1 text-red-600 hover:text-red-800 p-1"
                    title="Supprimer ce coiffeur"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-yellow-100 border border-yellow-300 p-3 rounded-lg mb-3">
              <p className="text-yellow-800">Aucun coiffeur enregistré. Ajoutez-en un pour commencer.</p>
            </div>
          )}
          
          {/* Formulaire d'ajout de coiffeur */}
          {!montrerAjoutCoiffeur ? (
            <button
              onClick={() => setMontrerAjoutCoiffeur(true)}
              className="flex items-center text-blue-600 hover:text-blue-800 text-sm bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Ajouter un nouveau coiffeur
            </button>
          ) : (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-blue-800 flex items-center">
                  <UserPlus className="w-4 h-4 mr-1" />
                  Nouveau coiffeur
                </h4>
                <button
                  onClick={annulerAjoutCoiffeur}
                  className="text-gray-500 hover:text-gray-700"
                  title="Annuler"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nouveauCoiffeur}
                  onChange={(e) => setNouveauCoiffeur(e.target.value)}
                  placeholder="Nom du coiffeur"
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && ajouterCoiffeur()}
                  autoFocus
                />
                <button
                  onClick={ajouterCoiffeur}
                  disabled={!nouveauCoiffeur.trim()}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Ajouter
                </button>
                <button
                  onClick={annulerAjoutCoiffeur}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Section Prestation */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 flex items-center">
            <Scissors className="w-4 h-4 mr-1" />
            Type de prestation
          </label>
          
          {/* Onglets catégories */}
          <div className="flex mb-3 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => {
                setCategorieSelectionnee('homme');
                setRecherchePrestation('');
                setSuggestionsVisible(false);
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                categorieSelectionnee === 'homme'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              👨 Homme
            </button>
            <button
              onClick={() => {
                setCategorieSelectionnee('femme');
                setRecherchePrestation('');
                setSuggestionsVisible(false);
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                categorieSelectionnee === 'femme'
                  ? 'bg-pink-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              👩 Femme
            </button>
            <button
              onClick={() => {
                setCategorieSelectionnee('enfant');
                setRecherchePrestation('');
                setSuggestionsVisible(false);
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                categorieSelectionnee === 'enfant'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🧒 Enfant
            </button>
          </div>

          {/* Barre de recherche pour prestations */}
          <div className="relative">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={prestationActuelle.prestation || recherchePrestation}
                onChange={(e) => {
                  setRecherchePrestation(e.target.value);
                  setSuggestionsVisible(true);
                  if (!e.target.value) {
                    setPrestationActuelle(prev => ({...prev, prestation: ''}));
                  }
                }}
                onFocus={() => setSuggestionsVisible(true)}
                placeholder={`Rechercher une prestation ${categorieSelectionnee}...`}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {prestationActuelle.prestation && (
                <button
                  onClick={() => {
                    setPrestationActuelle(prev => ({...prev, prestation: ''}));
                    setRecherchePrestation('');
                  }}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Liste des suggestions */}
            {suggestionsVisible && recherchePrestation && !prestationActuelle.prestation && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filtrerPrestations(recherchePrestation).map((prestation, index) => (
                  <button
                    key={index}
                    onClick={() => selectionnerPrestation(prestation)}
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    {prestation}
                  </button>
                ))}
                {filtrerPrestations(recherchePrestation).length === 0 && (
                  <div className="px-4 py-2 text-gray-500 text-center">
                    Aucune prestation trouvée
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Prestation sélectionnée */}
          {prestationActuelle.prestation && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-green-600 font-medium">Prestation sélectionnée:</span>
                  <div className="font-medium text-green-800">{prestationActuelle.prestation}</div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  categorieSelectionnee === 'homme' ? 'bg-blue-100 text-blue-800' :
                  categorieSelectionnee === 'femme' ? 'bg-pink-100 text-pink-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {categorieSelectionnee}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Prix */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 flex items-center">
            <Euro className="w-4 h-4 mr-1" />
            Prix
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {prixPredéfinis.map((prix) => (
              <button
                key={prix}
                onClick={() => setPrestationActuelle({...prestationActuelle, prix: prix.toString()})}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  prestationActuelle.prix === prix.toString()
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {prix}€
              </button>
            ))}
          </div>
          <input
            type="number"
            value={prestationActuelle.prix}
            onChange={(e) => setPrestationActuelle({...prestationActuelle, prix: e.target.value})}
            placeholder="Ou saisir un montant"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            onKeyPress={(e) => e.key === 'Enter' && validerSaisiePrix()}
          />
        </div>

        {/* NOUVEAU: Section Pourboire */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 flex items-center">
            <Gift className="w-4 h-4 mr-1" />
            Pourboire <span className="text-xs text-gray-500 ml-1">(optionnel)</span>
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {pourboiresPredéfinis.map((pourboire) => (
              <button
                key={pourboire}
                onClick={() => setPrestationActuelle({...prestationActuelle, pourboire: pourboire.toString()})}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  prestationActuelle.pourboire === pourboire.toString()
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {pourboire === 0 ? 'Aucun' : `${pourboire}€`}
              </button>
            ))}
          </div>
          <input
            type="number"
            value={prestationActuelle.pourboire}
            onChange={(e) => setPrestationActuelle({...prestationActuelle, pourboire: e.target.value})}
            placeholder="Ou saisir un montant"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {/* Mode de paiement */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 flex items-center">
            <CreditCard className="w-4 h-4 mr-1" />
            Mode de paiement
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setPrestationActuelle({...prestationActuelle, paiement: 'liquide'})}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                prestationActuelle.paiement === 'liquide'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              💵 Liquide
            </button>
            <button
              onClick={() => setPrestationActuelle({...prestationActuelle, paiement: 'carte'})}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                prestationActuelle.paiement === 'carte'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              💳 Carte
            </button>
          </div>
        </div>

        {/* Bouton d'ajout */}
        <button
          onClick={ajouterPrestation}
          disabled={!prestationActuelle.coiffeur || !prestationActuelle.prix || !prestationActuelle.paiement}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Ajouter la prestation
        </button>
      </div>

      {/* Liste des prestations */}
      {prestations.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Prestations du jour ({prestations.length})
            </h2>
            <div className="flex gap-2">
              <button
                onClick={telechargerExcel}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Télécharger Excel
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            {prestations.map((prestation, index) => {
              const prix = parseFloat(prestation.prix);
              const pourboire = parseFloat(prestation.pourboire || 0);
              const total = prix + pourboire;
              
              return (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="font-medium flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {prestation.coiffeur}
                      </span>
                      <span className="mx-1">•</span>
                      <span className="font-bold text-green-600 flex items-center">
                        <Euro className="w-4 h-4 mr-1" />
                        {prix.toFixed(2)}€
                      </span>
                      {pourboire > 0 && (
                        <>
                          <span className="mx-1">+</span>
                          <span className="font-bold text-purple-600 flex items-center">
                            <Gift className="w-4 h-4 mr-1" />
                            {pourboire.toFixed(2)}€
                          </span>
                          <span className="mx-1">=</span>
                          <span className="font-bold text-indigo-600 flex items-center">
                            <BarChart3 className="w-4 h-4 mr-1" />
                            {total.toFixed(2)}€
                          </span>
                        </>
                      )}
                      <span className="mx-2">•</span>
                      <span className={`px-2 py-1 rounded text-xs flex items-center ${
                        prestation.paiement === 'liquide' 
                          ? 'bg-orange-200 text-orange-800'
                          : 'bg-indigo-200 text-indigo-800'
                      }`}>
                        <CreditCard className="w-3 h-3 mr-1" />
                        {prestation.paiement}
                      </span>
                      <span className="mx-2 text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {prestation.heure}
                      </span>
                    </div>
                    {prestation.prestation && (
                      <div className="text-sm text-gray-600 mt-1 flex items-center">
                        <Scissors className="w-3 h-3 mr-1" />
                        {prestation.prestation}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => supprimerPrestation(index)}
                    className="text-red-600 hover:text-red-800 transition-colors ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Rapport Excel intégré - TOUJOURS VISIBLE */}
      <div className="mb-6">
        <div className="bg-yellow-100 border border-yellow-300 p-3 rounded-lg mb-4">
          <div className="flex items-center">
            <FileText className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="font-medium text-yellow-800">
              💾 Fichier CSV/Excel - Aperçu en temps réel
            </span>
          </div>
          <div className="text-sm text-yellow-700 mt-1">
            Format CSV compatible avec Excel, LibreOffice, Google Sheets • Téléchargement direct
          </div>
        </div>
        <RapportExcel />
      </div>
    </div>
  );
};

export default SalonApp;