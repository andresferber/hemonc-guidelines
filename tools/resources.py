# Page ONE link sections (master source): "Useful tools", "Educational resources", "Calculators".
# Edit here, then run: python3 tools/build_resources.py  -> writes resources.json
# Each section has panels; each panel has items:
#   n name, u URL, x one-line description (own words), opt flags: login=True (needs an account),
#   note="..." (short caution shown in muted text), ref=(label, url) supporting paper,
#   widget="iss" (a calculator built into the page)
# Andres chose (2026-10-25) to keep the Jefferson links in these Page ONE sections. This choice
# applies only here; it does not change the rules of the Landmark Trials project.

SECTIONS = {
"tools": [
  ("trials", "Clinical trials", "Find open studies", [
    dict(n="ClinicalTrials.gov", u="https://clinicaltrials.gov/", x="Registry of clinical studies worldwide (NIH)."),
    dict(n="Jefferson hematologic malignancy trials", u="https://www.jeffersonhealth.org/clinical-specialties/cancer/clinical-trials?search-query=&tag=health2021%2Fclinical-trials%2Foncology%2Fcancer-type%3A%3Ahealth2021%2Fclinical-trials%2Foncology%2Fcancer-type%2Fhodgkin-lymphoma&tag=health2021%2Fclinical-trials%2Foncology%2Fcancer-type%3A%3Ahealth2021%2Fclinical-trials%2Foncology%2Fcancer-type%2Fleukemia-other&tag=health2021%2Fclinical-trials%2Foncology%2Fcancer-type%3A%3Ahealth2021%2Fclinical-trials%2Foncology%2Fcancer-type%2Fnon-hodgkin-lymphoma&tag=health2021%2Fclinical-trials%2Foncology%2Fcancer-type%3A%3Ahealth2021%2Fclinical-trials%2Foncology%2Fcancer-type%2Fmyeloid-and-monocytic-leukemia&tag=health2021%2Fclinical-trials%2Foncology%2Fcancer-type%3A%3Ahealth2021%2Fclinical-trials%2Foncology%2Fcancer-type%2Fmycosis-fungoides&tag=health2021%2Fclinical-trials%2Foncology%2Fcancer-type%3A%3Ahealth2021%2Fclinical-trials%2Foncology%2Fcancer-type%2Fmultiple-myeloma&tag=health2021%2Fclinical-trials%2Foncology%2Fcancer-type%3A%3Ahealth2021%2Fclinical-trials%2Foncology%2Fcancer-type%2Fother-hematopoietic&tag=health2021%2Fclinical-trials%2Foncology%2Fcancer-type%3A%3Ahealth2021%2Fclinical-trials%2Foncology%2Fcancer-type%2Flymphoid-leukemia", x="Hematologic malignancy trials open at the Sidney Kimmel Cancer Center."),
    dict(n="Jefferson oncology clinical trials", u="https://www.jeffersonhealth.org/clinical-specialties/cancer/clinical-trials?search-query=", x="All cancer trials open at the Sidney Kimmel Cancer Center."),
    dict(n="Disease maps", u="https://tjuv.sharepoint.com/sites/CTOSharePoint/SitePages/Disease-Maps.aspx", x="Trial maps by disease, for Jefferson staff.", login=True),
  ]),
  ("gen", "Genetics and molecular biology", "Cytogenetics, mutations, genes, pathways", [
    dict(n="Atlas of Genetics and Cytogenetics in Oncology and Haematology", u="http://atlasgeneticsoncology.org/", x="Cytogenetic and molecular abnormalities in cancer, entity by entity."),
    dict(n="COSMIC", u="https://cancer.sanger.ac.uk/cosmic", x="Catalogue of somatic mutations in cancer."),
    dict(n="GeneCards", u="https://www.genecards.org/", x="Searchable, integrated database of human genes."),
    dict(n="Reactome", u="https://reactome.org/PathwayBrowser/", x="Browsable maps of cellular pathways."),
    dict(n="CD marker guide", u="https://en.wikipedia.org/wiki/List_of_human_clusters_of_differentiation", x="List of cluster of differentiation (CD) antigens and where they are expressed."),
    dict(n="Tumor Portal", u="http://www.tumorportal.org/", x="Cancer driver mutations across tumor types.", note="Last updated 2016"),
  ]),
  ("drugs", "Drugs and protocols", "Drug information, QT, chemotherapy orders", [
    dict(n="DailyMed", u="https://dailymed.nlm.nih.gov/dailymed/", x="Official FDA-approved prescribing information, without advertising (NLM)."),
    dict(n="Epocrates", u="https://online.epocrates.com/noFrame/", x="Drug reference and interaction checker."),
    dict(n="CredibleMeds", u="https://crediblemeds.org/", x="Drugs that prolong the QT interval, including oncology drugs.", login=True),
    dict(n="Penn State Cancer Institute chemotherapy orders", u="https://cancer.psu.edu/health-care-professionals/chemo-orders-and-consents", x="Chemotherapy order templates and protocols."),
  ]),
  ("pop", "Special populations", "Pregnancy and fertility, vaccination", [
    dict(n="ABCIP", u="https://www.ab-cip.org/", x="Advisory Board on Cancer, Infertility and Pregnancy: case advice and registry."),
    dict(n="CDC adult immunization schedule", u="https://www.cdc.gov/vaccines/hcp/imz-schedules/adult-age.html", x="Recommended adult vaccines by age and medical condition."),
  ]),
],
"edu": [
  ("ash", "ASH and journals", "Education program, webcasts, Blood", [
    dict(n="ASH Education Program (Hematology)", u="http://asheducationbook.hematologylibrary.org/content/current", x="Annual ASH education program papers, free full text."),
    dict(n="ASH webcasts", u="https://aaod2.hematology.org/page/webcasts", x="Recorded ASH education sessions."),
    dict(n="Blood", u="http://www.bloodjournal.org/", x="The journal of the American Society of Hematology."),
    dict(n="ASH Image Bank", u="https://imagebank.hematology.org/", x="Peer-reviewed hematology images: smears, marrow, pathology."),
    dict(n="Jefferson library", u="http://library.jefferson.edu/scott.cfm", x="Scott Memorial Library, Thomas Jefferson University.", login=True),
  ]),
  ("anat", "Anatomy and infection", "Dermatomes, 3D anatomy, infection maps", [
    dict(n="Dermatomes", u="https://en.wikipedia.org/wiki/Dermatome_(anatomy)#/media/File:Grant_1962_663.png", x="Dermatome map (Grant's atlas)."),
    dict(n="BioDigital Human", u="https://human.biodigital.com/index.html", x="Interactive 3D human anatomy."),
    dict(n="Infection Landscapes", u="http://www.infectionlandscapes.org/", x="Geographic distribution of infections around the world, with maps."),
  ]),
],
"calc": [
  ("gen", "General calculators", "Calculator collections", [
    dict(n="MDCalc", u="https://www.mdcalc.com/", x="Hundreds of clinical calculators in one site."),
    dict(n="QxMD Calculate", u="https://qxmd.com/calculate", x="Medical calculators organized by specialty."),
  ]),
  ("mye", "Myeloid malignancies", "AML, MDS, MPN, CML, CHIP/CCUS, CMML", [
    dict(n="AML composite model", u="http://www.amlcompositemodel.org/", x="Predicts outcome in AML from clinical and genetic data."),
    dict(n="IPSS-M risk calculator", u="https://www.mds-risk-model.com/", x="Molecular International Prognostic Scoring System for MDS."),
    dict(n="MPN multistage calculator", u="https://www.sanger.ac.uk/tool/progmod/progmod/", x="MPN prognosis from clinical and molecular data (Grinfeld, Nangalia et al. 2018)."),
    dict(n="Sokal score", u="https://www.mdcalc.com/calc/2143/sokal-index-chronic-myelogenous-leukemia-cml", x="CML prognostic score."),
    dict(n="EUTOS score", u="https://www.mdcalc.com/calc/3906/eutos-score-chronic-myelogenous-leukemia-cml", x="CML prognostic score."),
    dict(n="MN-predict", u="https://bioinf.stemcells.cam.ac.uk/shiny/vassiliou/MN_predict", x="Risk of myeloid neoplasm in CHIP and CCUS."),
    dict(n="CCUS risk prediction score", u="https://www.andresferber.org/uploads/5/6/7/1/56718329/ccus_risk_score.jpeg", x="Risk score for clonal cytopenia of undetermined significance (image)."),
    dict(n="CHRS score", u="https://pmc.ncbi.nlm.nih.gov/articles/PMC10361696/", x="Clonal hematopoiesis risk score (paper with scoring table)."),
    dict(n="iCPSS: CMML risk calculator", u="https://icpss-risk.com/", x="CMML risk score.", ref=("Lanino et al. J Clin Oncol 2026", "https://ascopubs.org/doi/full/10.1200/JCO-25-02116")),
  ]),
  ("thr", "Thrombosis and TTP", "VTE risk, recurrence, TTP", [
    dict(n="Khorana score", u="https://www.mdcalc.com/calc/3315/khorana-risk-score-venous-thromboembolism-cancer-patients", x="VTE risk in ambulatory patients with cancer."),
    dict(n="Caprini score", u="https://www.mdcalc.com/calc/3970/caprini-score-venous-thromboembolism-2005", x="VTE risk in surgical patients."),
    dict(n="Rogers score", u="https://pubmed.ncbi.nlm.nih.gov/17544079/", x="VTE risk in general and vascular surgery (original paper with the scoring table).", note="Online calculator no longer available"),
    dict(n="IMPACT-ILL", u="https://pubmed.ncbi.nlm.nih.gov/21436241/", x="VTE risk in hospitalized medical patients (original paper with the model).", note="Online calculator no longer available"),
    dict(n="Vienna prediction model", u="https://pmc.ncbi.nlm.nih.gov/articles/PMC3959721/", x="Risk of recurrent VTE after stopping anticoagulation (updated model with nomograms, free full text).", note="Online calculator no longer available"),
    dict(n="PLASMIC score", u="https://www.mdcalc.com/calc/10200/plasmic-score-ttp", x="Likelihood of severe ADAMTS13 deficiency (TTP)."),
  ]),
  ("hlh", "HLH", "Diagnosis and probability", [
    dict(n="HScore (HLH probability)", u="http://saintantoine.aphp.fr/score/", x="Probability of reactive hemophagocytic syndrome."),
    dict(n="HLH-2004 diagnostic criteria", u="https://www.andresferber.org/uploads/5/6/7/1/56718329/204_hlh_diagnostic_criteria.png", x="Diagnostic criteria table (image).", ref=("La Rosée et al. Blood 2019;133:2465-77", "https://pubmed.ncbi.nlm.nih.gov/30992265/")),
  ]),
  ("lym", "Lymphoid malignancies", "Lymphoma and Waldenström indexes", [
    dict(n="FLIPI", u="https://www.mdcalc.com/calc/2320/follicular-lymphoma-international-prognostic-index-flipi", x="Follicular Lymphoma International Prognostic Index."),
    dict(n="IPI and R-IPI", u="https://www.mdcalc.com/calc/3936/international-prognostic-index-diffuse-large-b-cell-lymphoma-ipi-r-ipi", x="Prognostic indexes for diffuse large B-cell lymphoma."),
    dict(n="MIPI", u="https://www.mdcalc.com/calc/4053/mantle-cell-lymphoma-international-prognostic-index-mipi", x="Mantle Cell Lymphoma International Prognostic Index."),
    dict(n="Asymptomatic Waldenström progression", u="https://awmrisk.com/", x="Risk of progression in asymptomatic Waldenström macroglobulinemia."),
  ]),
  ("mg", "Monoclonal gammopathies", "MGUS, myeloma staging", [
    dict(n="ISS stage", u="", x="International Staging System for myeloma, calculated here.", widget="iss"),
    dict(n="R2-ISS", u="https://r2-iss-calc.streamlit.app/", x="Second revision of the ISS for myeloma."),
    dict(n="iStopMM risk model", u="https://istopmm.com/riskmodel/", x="Probability of smoldering myeloma or worse in a person with MGUS."),
  ]),
  ("card", "Cardio-oncology", "Baseline cardiovascular risk", [
    dict(n="HFA-ICOS baseline risk", u="https://www.mdcalc.com/calc/10642/hfa-icos-baseline-cardio-oncology-risk-assessment-anthracycline-chemotherapy", x="Baseline cardiovascular risk before anthracycline chemotherapy."),
  ]),
],
}

TITLES = {"tools": "Useful tools", "edu": "Educational resources", "calc": "Scores and calculators"}
