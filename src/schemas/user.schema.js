module.exports = (sequelize, DataTypes) => {
    return sequelize.define('users', {
        id: {
            primaryKey: true,
            type: DataTypes.STRING,
        },
        username: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
        name: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
        avatar: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
        password: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
        vanity: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
        verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        email: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
        verifiedEmail: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        createdAt: {
            type: DataTypes.DATE,
        },
        updatedAt: {
            type: DataTypes.DATE,
        },
        verifiedAt: {
            type: DataTypes.DATE,
        }
    });
}