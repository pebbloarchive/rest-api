module.exports = (sequelize, DataTypes) => {
    return sequelize.define('profiles', {
        id: {
            primaryKey: true,
            type: DataTypes.STRING,
		},
		wallpaper: {
			type: DataTypes.STRING,
			defaultValue: '',
		},
		description: {
			type: DataTypes.STRING,
			defaultValue: '',
		},
		location: {
			type: DataTypes.STRING,
			defaultValue: '',
		},
		website: {
			type: DataTypes.STRING,
			defaultValue: '',
		},
		followers: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		following: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		posts: {
			type: DataTypes.JSONB,
			defaultValue: posts = {
				id: '',
				description: '',
				likes: {
					users: [],
					has: 0
				}
			}
		}
	});
}