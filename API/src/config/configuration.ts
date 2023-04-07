export const configuration = () => ({
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    DATABASE: {
        DATABASE_HOST: process.env.DATABASE_HOST,
        DATABASE_PORT: process.env.DATABASE_PORT,
        DATABASE_NAME: process.env.DATABASE_NAME,
        DATABASE_USERNAME: process.env.DATABASE_USERNAME,
        DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    },
    MAILER: {
        SENDGRID_HOST: process.env.SENDGRID_HOST,
        SENDFRID_USERNAME: process.env.SENDFRID_USERNAME,
        SENDFRID_PASSWORD: process.env.SENDFRID_PASSWORD,
    },
});
