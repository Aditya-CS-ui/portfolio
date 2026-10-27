// Site content. Edit the text here; the components only render it.
export const PROJECTS=[
{t:"LesionLens",k:"medai",track:"Medical AI",st:"proto",label:"Prototype",d:"An AI web app that classifies skin lesion photos into seven categories and shows a heatmap of the regions behind each prediction.",o:"Top 5 at the Delhi Hackathon. Selected in a GeeksforGeeks hackathon.",s:"Flask, PyTorch, EfficientNet-B3, Grad-CAM, SQLite, Docker",x:[
["How it works","Upload a skin lesion photo and the model returns the most likely of seven lesion categories with a confidence score. Each result includes a Grad-CAM heatmap that shows which parts of the image drove the prediction."],
["Model","EfficientNet-B3 trained on the seven HAM10000 categories: Actinic Keratosis, Basal Cell Carcinoma, Benign Keratosis, Dermatofibroma, Melanoma, Melanocytic Nevi, and Vascular Lesion. Images are resized to 300 by 300 and normalized with ImageNet statistics."],
["Explainability","Grad-CAM reads the gradients of the final convolution layer, turns them into a heatmap, and blends it over the original image. Each category also has a plain-language note on what the model focused on."],
["Doctor review","Patients submit a report with the prediction and heatmap. A doctor portal lists pending reports, and the doctor approves or rejects each one with a note. Patients can track their report status."],
["Stack","Python, Flask, PyTorch, timm, Pillow, SQLite, Gunicorn, Docker, with a HTML, CSS, and JavaScript frontend."]]},
{t:"HeaderHunter",k:"security",track:"Security",st:"done",label:"Completed",d:"A web security analyzer that checks a site's HTTP response headers, scores the protections out of 100, and explains each gap in plain language.",o:"3rd place, Hacktoberfest Hackathon, CMP College, Prayagraj (18 October 2026)",s:"Node.js, Express 5, JavaScript, Ollama (Gemma)",x:[
["How it works","Paste raw HTTP response headers or pick a sample set. The analyzer checks the headers that protect against the most common web attacks and returns a score with a ranked list of findings."],
["What it checks","Content-Security-Policy (25 points), Strict-Transport-Security (20), X-Content-Type-Options (15), Referrer-Policy (15), and clickjacking protection through X-Frame-Options or CSP frame-ancestors (25). Weak settings earn partial credit."],
["Beyond the score","Flags cookies missing Secure, HttpOnly, or SameSite flags, and server headers that reveal software versions. Every finding gets a risk rank, so the most urgent fixes come first."],
["AI explanations","A local Gemma model, run through Ollama, explains each finding and suggests a fix. No API keys or cloud services are used, and the score still works if the model is offline."],
["Stack","Node.js, Express 5, a vanilla JavaScript dashboard, and a JSON API with sample data for testing."]]},
{t:"Can You Run It?",k:"tools",track:"Tools",st:"done",label:"Completed",d:"A hardware checker that reads your PC's specs and tells you which popular games it can run.",o:"",s:"Python, psutil, GPUtil, HTML, CSS, Vercel",x:[
["How it works","Detects your OS, CPU, physical cores and threads, RAM, and GPU, then compares them with requirement tiers for VALORANT, Minecraft (Java), Fortnite, and Counter-Strike 2."],
["Results","Each game shows the highest tier you meet, or below minimum. Results are colour-coded, and each game has a note about its specific requirements, such as Secure Boot for VALORANT."],
["Live usage","Shows current RAM and CPU usage as bars, so you can see how much headroom your machine has right now."],
["Two versions","A Python command-line tool using psutil and GPUtil, and a web interface deployed as a static site on Vercel."],
["Note","The requirement tiers are simplified. Check the publisher's official pages before relying on an exact result."]]},
{t:"Soul & Scents",k:"web",track:"Web design",st:"done",label:"Client demo",d:"A landing page for a handmade fragrance brand, built as a client project.",o:"",s:"HTML, CSS, JavaScript, Google Fonts",x:[
["Structure","A single responsive page with a hero section, a product collection, a how-to-order guide, and an about section."],
["Design","A soft palette of pink, peach, cream, mauve, and gold, with Cormorant Garamond headings and Jost body text to suit a boutique brand."],
["Ordering","Customers place orders through a WhatsApp card rather than a cart, which suits a small handmade business."],
["Status","The client withdrew from the project, so this stays as a portfolio demo and is not a live store."]]},
{t:"WikiClub Tech UU Website",k:"web",track:"Web",st:"on",label:"Ongoing",d:"The website for the university tech club, with a Student Helpdesk for students.",o:"My role: Development Team Lead, WikiClub Tech UU",s:"Full-stack web development, open source",x:[
["Student Helpdesk","Previous year questions (PYQs), FAQs, social links, contact details, and Meta pages, all in one place for students."],
["Current work","Repository migration, feature integration, frontend and backend improvements, and ongoing maintenance."],
["My role","I lead the development team's technical work at WikiClub Tech UU, including the website, repository management, and coordinating contributors."]]},
{t:"ASTRA: Smart Rural Eye Care",k:"medai",track:"Medical AI",st:"on",label:"Ongoing prototype",d:"Diabetic retinopathy screening for rural India, using retinal images.",o:"",s:"Computer vision, Grad-CAM, explainable AI",x:[
["How it works","Analyzes retinal images, predicts disease severity, and explains each prediction with Grad-CAM so the result is visible to the reviewing doctor."],
["Doctor workflow","Doctors review and verify each generated report before it is used."],
["Planned","Admin analytics, image-quality checks, local-language assistance for patients, and model improvement from doctor feedback."]]},
{t:"PharmaGuard",k:"hack",track:"Hackathon",st:"done",label:"Hackathon",d:"A healthcare project built for the RIFT Hackathon around a selected problem statement in pharmaceutical safety.",o:"RIFT Hackathon participant",s:"Healthcare technology",x:[
["Focus","Pharmaceutical safety, built within the time limit of a hackathon around the chosen problem statement."]]},
{t:"Malaria Parasite Classification",k:"res",track:"Research",st:"done",label:"Experiments completed",d:"A machine learning system that classifies blood-cell images as parasitized or uninfected.",o:"SVM reached 95.25% test accuracy and an AUC of 0.9856.",s:"Otsu thresholding, GWO, SVM, Random Forest, SHAP",x:[
["Preprocessing","Otsu thresholding and morphological operations separate the cells from the background in each microscope image."],
["Feature extraction","146 handcrafted features are extracted from each image."],
["Feature selection","Grey Wolf Optimization (GWO) selects the 19 most useful features."],
["Models","An SVM classifier performed best. Random Forest and a stacked ensemble with Logistic Regression were also explored."],
["Interpretability","SHAP values show how much each feature pushed a prediction toward parasitized or uninfected, so the model's decisions can be checked."]]},
{t:"Astra Social Companion",k:"concept",track:"Concept",st:"idea",label:"Concept",d:"A social platform concept that encourages meaningful interaction instead of endless scrolling.",o:"",s:"Product design, trust and safety",x:[
["Idea","Social features that reward real conversation and limit compulsive use."],
["Features","Interaction limits, reputation indicators, moderation tools, and parental oversight."],
["Status","A product concept. No code has been built yet."]]}
];
// [key, label]
export const FILTERS=[['all','All'],['security','Security'],['medai','Medical AI'],['web','Web'],['tools','Tools'],['hack','Hackathon'],['res','Research'],['concept','Concept']];
// [when, title, detail]
export const ACHIEVEMENTS=[['18 Oct 2026','Third place, Hacktoberfest Hackathon','CMP College, Prayagraj, with Google Developer Groups Prayagraj and Major League Hacking. Presented HeaderHunter, a website security analysis tool.'],['Delhi Hackathon','Top 5 finish','LesionLens, an AI-assisted skin lesion analysis project.'],['GeeksforGeeks Hackathon','Project selected','LesionLens was selected in a GeeksforGeeks hackathon.'],['RIFT Hackathon','Participant','PharmaGuard, built around a selected problem statement.'],['Research','95.25% test accuracy','SVM result in my malaria parasite classification experiments.']];
// [group, comma-separated chips]
export const SKILLS=[['Languages','C, Java, JavaScript, Python'],['Web','HTML and CSS, React, Node.js, Next.js, Full-stack development'],['Machine learning','EfficientNet-B3, Grad-CAM, SHAP, SVM, Random Forest, Grey Wolf Optimization'],['Image analysis','Otsu thresholding, Morphological operations, Radiomics, Feature extraction'],['Security','HTTP security headers, Misconfiguration analysis'],['Computer science','Data structures and algorithms, Automata theory, Complexity theory, Discrete mathematics, Object-oriented design'],['Leadership','Club leadership, Open source, Repository management']];
export const EMAIL=['aditya.gaurav.cs','gmail.com'].join('@');
