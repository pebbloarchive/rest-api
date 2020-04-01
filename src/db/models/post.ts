export default (sequelize, DataTypes) => {
    return sequelize.define('posts', {
        id: {
            primaryKey: true,
            type: DataTypes.BIGINT
        },
        author: {
            type: DataTypes.BIGINT
        },
        content: {
            type: DataTypes.STRING,
            default: ''
        },
        likes: {
            type: DataTypes.ARRAY(DataTypes.STRING), 
            default: []           
        },
        created_at: {
            type: DataTypes.DATE
        },
        updated_at: {
            type: DataTypes.DATE
        }
    });
}