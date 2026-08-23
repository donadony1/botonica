import React, { useState } from 'react';
import { ScreenType } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface PrivacyTermsScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

type TabType = 'cgv' | 'privacy';

export const PrivacyTermsScreen: React.FC<PrivacyTermsScreenProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('cgv');

  return (
    <div className="w-full flex flex-col bg-[#fdf9f5] text-[#1c1c19] min-h-screen pb-24">
      {/* Breadcrumb & Navigation */}
      <div className="px-5 sm:px-8 md:px-12 pt-8 pb-4 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2 text-xs text-[#81756e]">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-[#3D2B1F] transition-colors cursor-pointer"
          >
            {language === 'fr' ? 'Accueil' : 'Home'}
          </button>
          <span>/</span>
          <span className="text-[#3D2B1F] font-medium">
            {language === 'fr' ? 'Termes & Confidentialité' : 'Terms & Privacy'}
          </span>
        </div>
      </div>

      {/* Header Banner */}
      <header className="px-5 sm:px-8 md:px-12 pt-4 pb-8 max-w-5xl mx-auto w-full text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E6D5C3]/60 text-[#3D2B1F] text-xs font-semibold uppercase tracking-wider">
          <span className="material-symbols-outlined text-[16px]">verified_user</span>
          <span>{language === 'fr' ? 'Transparence & Conformité Légale' : 'Legal Transparency & Compliance'}</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#26170c] font-normal leading-tight">
          {language === 'fr'
            ? 'Conditions Générales & Confidentialité'
            : 'Terms of Service & Privacy Policy'}
        </h1>

        <p className="text-sm sm:text-base text-[#64635c] max-w-2xl mx-auto font-light leading-relaxed">
          {language === 'fr'
            ? 'Découvrez nos engagements éthiques, nos conditions de vente et les garanties strictes de protection de vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD).'
            : 'Learn about our ethical commitments, terms of purchase, and strict GDPR privacy safeguards ensuring your personal data is protected at all times.'}
        </p>

        {/* Tab Switcher */}
        <div className="flex items-center justify-center gap-3 pt-6">
          <div className="bg-white p-1.5 rounded-full border border-[#E6D5C3] shadow-xs flex items-center gap-2">
            <button
              onClick={() => setActiveTab('cgv')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'cgv'
                  ? 'bg-[#3D2B1F] text-white shadow-xs'
                  : 'text-[#64635c] hover:text-[#26170c]'
              }`}
            >
              {language === 'fr' ? '1. Conditions Générales de Vente (CGV)' : '1. Terms of Sale (TOS)'}
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'privacy'
                  ? 'bg-[#3D2B1F] text-white shadow-xs'
                  : 'text-[#64635c] hover:text-[#26170c]'
              }`}
            >
              {language === 'fr' ? '2. Politique de Confidentialité (RGPD)' : '2. Privacy Policy (GDPR)'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Document Body */}
      <main className="px-5 sm:px-8 md:px-12 max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-[#E6D5C3] shadow-xs space-y-8 text-[#26170c] leading-relaxed text-sm">
          {/* Quick Print bar */}
          <div className="flex justify-between items-center pb-4 border-b border-[#E6D5C3]">
            <span className="text-xs text-[#81756e]">
              {language === 'fr' ? 'Dernière mise à jour : 23 Août 2026' : 'Last updated: August 23, 2026'}
            </span>
            <button
              onClick={() => window.print()}
              className="text-xs text-[#3D2B1F] hover:text-[#bb0a4a] flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>{language === 'fr' ? 'Imprimer cette page' : 'Print this page'}</span>
            </button>
          </div>

          {/* TAB 1: CONDITIONS GÉNÉRALES DE VENTE (CGV) */}
          {activeTab === 'cgv' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <section className="space-y-3">
                <h2 className="font-serif text-2xl text-[#26170c] font-semibold border-b border-[#E6D5C3]/60 pb-2">
                  Article 1 : Mentions Légales & Éditeur du Site
                </h2>
                <p>
                  Le présent site e-commerce <strong>Ndolo Rituals</strong> (accessible à l'adresse <em>ndolo-rituals.fr</em>) est édité par la société <strong>Ndolo Rituals SARL</strong>, société à responsabilité limitée au capital de 25 000 €, immatriculée au Registre du Commerce et des Sociétés d'Aix-en-Provence sous le numéro <strong>SIRET 894 302 119 00024</strong>.
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs text-[#4f453f] bg-[#fdf9f5] p-4 rounded-xl border border-[#E6D5C3]/60">
                  <li><strong>Siège social :</strong> 14 Rue des Lavandes, 13100 Aix-en-Provence, France</li>
                  <li><strong>Numéro de TVA intracommunautaire :</strong> FR 48 894302119</li>
                  <li><strong>Directrice de la publication :</strong> Karene Bella</li>
                  <li><strong>Contact service client :</strong> contact@ndolo-rituals.fr | +33 4 42 00 00 00</li>
                  <li><strong>Hébergement :</strong> Serveurs sécurisés situés dans l'Union Européenne (RGPD compliant)</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-2xl text-[#26170c] font-semibold border-b border-[#E6D5C3]/60 pb-2">
                  Article 2 : Objet & Champ d'Application
                </h2>
                <p>
                  Les présentes Conditions Générales de Vente (CGV) régissent l'ensemble des ventes conclues entre Ndolo Rituals SARL et toute personne physique ou morale effectuant un achat sur le site. Toute validation de commande implique l'adhésion pleine et sans réserve de l'acheteur aux présentes conditions.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-2xl text-[#26170c] font-semibold border-b border-[#E6D5C3]/60 pb-2">
                  Article 3 : Caractéristiques des Produits & Conformité Cosmétique
                </h2>
                <p>
                  Les produits proposés sont des savons artisanaux saponifiés à froid, des huiles végétales pures et des rituels botaniques naturels. Conformément au <strong>Règlement Européen (CE) N° 1223/2009</strong> et aux exigences du <strong>Règlement Général sur la Sécurité des Produits (GPSR)</strong> :
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-[#4f453f]">
                  <li>Chaque soin dispose d'un Dossier d'Information sur le Produit (DIP) validé par un toxicologue d'État.</li>
                  <li>La liste complète des ingrédients <strong>INCI</strong> est consultable sur chaque fiche produit et emballage.</li>
                  <li>La Période Après Ouverture (PAO) standard est de <strong>18 Mois</strong>.</li>
                  <li>Les photos des produits sont les plus fidèles possibles mais ne peuvent assurer une similitude parfaite avec le produit physique en raison du caractère 100% artisanal et naturel des marbrures et teintes.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-2xl text-[#26170c] font-semibold border-b border-[#E6D5C3]/60 pb-2">
                  Article 4 : Tarifs & Modalités de Paiement
                </h2>
                <p>
                  Les prix de nos soins sont indiqués en <strong>Euros (€) Toutes Taxes Comprises (TTC)</strong>, tenant compte de la TVA applicable au jour de la commande (20% en France métropolitaine). Les frais de livraison sont offerts dès <strong>50,00 €</strong> d'achat.
                </p>
                <p>Les modes de paiement acceptés sur notre plateforme sécurisée sont :</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 bg-[#fdf9f5] rounded-xl border border-[#E6D5C3]/60">
                    <strong className="block text-[#3D2B1F]">💳 Cartes Bancaires (Visa, Mastercard)</strong>
                    <span className="text-xs text-[#81756e]">Protocole 3D-Secure & cryptage SSL 256-bit (Stripe).</span>
                  </div>
                  <div className="p-3.5 bg-[#fdf9f5] rounded-xl border border-[#E6D5C3]/60">
                    <strong className="block text-[#3D2B1F]">📱 Mobile Money (Orange Money, MTN MoMo)</strong>
                    <span className="text-xs text-[#81756e]">Paiement instantané pour le Cameroun et l'Afrique.</span>
                  </div>
                  <div className="p-3.5 bg-[#fdf9f5] rounded-xl border border-[#E6D5C3]/60">
                    <strong className="block text-[#3D2B1F]">🅿️ PayPal Express</strong>
                    <span className="text-xs text-[#81756e]">Règlement direct avec protection des achats.</span>
                  </div>
                  <div className="p-3.5 bg-[#fdf9f5] rounded-xl border border-[#E6D5C3]/60">
                    <strong className="block text-[#3D2B1F]">🏦 Virement Bancaire SEPA</strong>
                    <span className="text-xs text-[#81756e]">Expédition de la commande dès réception des fonds.</span>
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-2xl text-[#26170c] font-semibold border-b border-[#E6D5C3]/60 pb-2">
                  Article 5 : Facturation Automatique & Expédition
                </h2>
                <p>
                  Dès confirmation et validation du paiement, une <strong>facture officielle numérotée</strong> est automatiquement éditée, enregistrée dans notre système de gestion et adressée par courrier électronique à l'adresse renseignée par le client.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-2xl text-[#26170c] font-semibold border-b border-[#E6D5C3]/60 pb-2">
                  Article 6 : Droit de Rétractation (14 Jours)
                </h2>
                <p>
                  Conformément aux dispositions de l'article L.221-18 du Code de la Consommation, l'acheteur dispose d'un délai de <strong>14 jours francs</strong> à compter de la réception de sa commande pour exercer son droit de rétractation sans avoir à justifier de motifs.
                </p>
                <p className="text-xs bg-amber-50 text-amber-900 p-3 rounded-xl border border-amber-200">
                  <strong>⚠️ Exception d'hygiène :</strong> Pour des raisons de protection de la santé et d'hygiène (art. L.221-28 5°), les produits cosmétiques et savons ouverts, descellés ou entamés après livraison ne peuvent faire l'objet d'un retour.
                </p>
              </section>
            </div>
          )}

          {/* TAB 2: POLITIQUE DE CONFIDENTIALITÉ (RGPD) */}
          {activeTab === 'privacy' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <section className="space-y-3">
                <h2 className="font-serif text-2xl text-[#26170c] font-semibold border-b border-[#E6D5C3]/60 pb-2">
                  1. Engagement & Responsable du Traitement
                </h2>
                <p>
                  Ndolo Rituals s'engage fermement à respecter et protéger la vie privée de ses utilisateurs conformément au <strong>Règlement Général sur la Protection des Données (RGPD 2016/679)</strong> et à la loi Informatique et Libertés.
                </p>
                <p>
                  Le responsable du traitement des données est la société <strong>Ndolo Rituals SARL</strong>, domiciliée au 14 Rue des Lavandes, 13100 Aix-en-Provence, France (Délégué à la Protection des Données : <em>dpo@ndolo-rituals.fr</em>).
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-2xl text-[#26170c] font-semibold border-b border-[#E6D5C3]/60 pb-2">
                  2. Données Personnelles Collectées
                </h2>
                <p>Nous collectons uniquement les informations nécessaires au bon déroulement de votre expérience et à l'exécution de vos commandes :</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#fdf9f5] p-3.5 rounded-xl border border-[#E6D5C3]/60">
                    <strong className="block text-[#3D2B1F] mb-1">Identité & Coordonnées</strong>
                    <span className="text-[#64635c]">Nom, prénom, adresse e-mail, numéro de téléphone, adresse postale de livraison et de facturation.</span>
                  </div>
                  <div className="bg-[#fdf9f5] p-3.5 rounded-xl border border-[#E6D5C3]/60">
                    <strong className="block text-[#3D2B1F] mb-1">Données de Transaction</strong>
                    <span className="text-[#64635c]">Détails des articles commandés, numéro de facture, historique d'achats (aucune coordonnée bancaire n'est stockée sur nos serveurs).</span>
                  </div>
                  <div className="bg-[#fdf9f5] p-3.5 rounded-xl border border-[#E6D5C3]/60">
                    <strong className="block text-[#3D2B1F] mb-1">Données de Navigation</strong>
                    <span className="text-[#64635c]">Adresse IP anonymisée, préférences de langue, panier d'achat sauvegardé localement.</span>
                  </div>
                  <div className="bg-[#fdf9f5] p-3.5 rounded-xl border border-[#E6D5C3]/60">
                    <strong className="block text-[#3D2B1F] mb-1">Avis & Témoignages</strong>
                    <span className="text-[#64635c]">Commentaires et notes attribués aux soins botaniques après achat.</span>
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-2xl text-[#26170c] font-semibold border-b border-[#E6D5C3]/60 pb-2">
                  3. Finalités du Traitement
                </h2>
                <p>Vos données personnelles sont traitées pour les finalités exclusives suivantes :</p>
                <ul className="list-disc list-inside space-y-1 text-xs text-[#4f453f]">
                  <li>Traitement, préparation et livraison de vos commandes de cosmétiques.</li>
                  <li><strong>Émission et envoi automatique de vos factures acquittées par email.</strong></li>
                  <li>Gestion de la relation client, assistance et suivi des expéditions.</li>
                  <li>Respect de nos obligations légales, fiscales et comptables.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-2xl text-[#26170c] font-semibold border-b border-[#E6D5C3]/60 pb-2">
                  4. Durée de Conservation des Données
                </h2>
                <ul className="list-disc list-inside space-y-1 text-xs text-[#4f453f]">
                  <li><strong>Données relatives aux commandes et factures :</strong> 10 ans (obligation légale comptable et fiscale française).</li>
                  <li><strong>Données de prospection / newsletter :</strong> 3 ans à compter du dernier contact actif.</li>
                  <li><strong>Cookies techniques et préférences :</strong> 13 mois maximum.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-2xl text-[#26170c] font-semibold border-b border-[#E6D5C3]/60 pb-2">
                  5. Vos Droits RGPD & Exercice des Droits
                </h2>
                <p>
                  Conformément aux articles 15 à 22 du RGPD, vous disposez des droits suivants sur vos données personnelles :
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-semibold">
                  <div className="bg-[#fdf9f5] p-2.5 rounded-xl border border-[#E6D5C3]/60">Droit d'accès</div>
                  <div className="bg-[#fdf9f5] p-2.5 rounded-xl border border-[#E6D5C3]/60">Rectification</div>
                  <div className="bg-[#fdf9f5] p-2.5 rounded-xl border border-[#E6D5C3]/60">Effacement / Oubli</div>
                  <div className="bg-[#fdf9f5] p-2.5 rounded-xl border border-[#E6D5C3]/60">Portabilité</div>
                </div>
                <p className="text-xs pt-2">
                  Pour exercer l'un de ces droits, adressez simplement votre demande par courrier électronique à <strong>dpo@ndolo-rituals.fr</strong> en joignant un justificatif d'identité. Une réponse vous sera apportée dans un délai maximum de 30 jours.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="font-serif text-2xl text-[#26170c] font-semibold border-b border-[#E6D5C3]/60 pb-2">
                  6. Sécurité & Confidentialité des Données
                </h2>
                <p>
                  Ndolo Rituals met en œuvre des mesures techniques et organisationnelles renforcées (certificats SSL, chiffrement des bases de données, pare-feu applicatif) afin de garantir la protection absolue de vos données contre toute destruction, perte, altération ou divulgation non autorisée.
                </p>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
