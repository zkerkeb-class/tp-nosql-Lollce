import mongoose from "mongoose";

const connect = async () => {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        console.error("❌ MONGODB_URI n'est pas définie dans le fichier .env");
        throw new Error("MONGODB_URI manquante");
    }

    try {
        await mongoose.connect(uri);
        console.log('Connecté à MongoDB !');
    } catch (error) {
        console.error('Erreur de connexion à MongoDB :', error);
        throw error;
    }
};

export default connect;