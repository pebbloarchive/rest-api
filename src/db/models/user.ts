export default (sequelize, DataTypes) => {
    return sequelize.define('users', {
        id: {
            primaryKey: true,
            type: DataTypes.BIGINT
        },
        username: {
            type: DataTypes.STRING,
            default: ''
        },
        name: {
            type: DataTypes.STRING,
            default: ''
        },
        avatar: {
            type: DataTypes.STRING,
            default: ''
        },
        password: {
            type: DataTypes.STRING,
            default: ''
        },
        vanity: {
            type: DataTypes.STRING,
            default: ''
        },
        email: {
            type: DataTypes.STRING,
            default: ''
        },
        verified_email: {
            type: DataTypes.BOOLEAN,
            default: false
        },
        bio: {
            type: DataTypes.STRING,
            default: ''
        },
        email_code: {
            type: DataTypes.STRING,
            default: ''
        },
        created_at: {
            type: DataTypes.DATE
        },
        updated_at: {
            type: DataTypes.DATE
        },
        verified_at: {
            type: DataTypes.DATE
        },
        admin: {
            type: DataTypes.BOOLEAN,
            default: false
        },
        mod: {
            type: DataTypes.BOOLEAN,
            default: false
        },
        suspended: {
            type: DataTypes.BOOLEAN,
            default: false
        },
        suspended_date: {
            type: DataTypes.DATE
        },
        following: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            default: []
        },
        followers: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            default: []
        },
        blocked: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            default: []
        },
        mfa: {
            type: DataTypes.BOOLEAN,
            default: false
        },
        mfa_backup: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            default: []
        },
    });
}