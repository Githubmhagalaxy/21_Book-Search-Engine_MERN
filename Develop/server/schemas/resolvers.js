const {signToken} = require("../utils/auth");
const {User} = require('../models')

module.exports = {
    Query: {
        // get a single user by either their id or their username
        me: async (parent, args, context, info) => {
            const foundUser = await User.findOne({
                $or: [{_id: context.getUser() ? context.getUser()._id : args.id}, {username: args.username}],
            });
            if (!foundUser) {
                return null;
            }
            return foundUser
        }
    },
    Mutation: {
        login: async (parent, args, context, info) => {
            const user = await User.findOne({
                email: args.email
            });
            if (!user) {
                return null
            }
            const correctPw = await user.isCorrectPassword(args.password);
            if (!correctPw) {
                return null;
            }
            const token = signToken(user);
            return {
                token,
                user
            }
        },
        addUser: async (parent, args, context, info) => {
            const {username, email, password} = args;
            const user = await User.create({
                username, email, password
            });
            if (!user) {
                return null;
            }
            const token = signToken(user);
            return {
                token, user
            }
        },
        saveBook: async (parent, args, context, info) => {
            const {authors, description, title, bookId, image, link} = args;
            const data = {authors, description, title, bookId, image, link};
            const user = context.getUser();
            try {
                return await User.findOneAndUpdate(
                    {_id: user._id},
                    {$addToSet: {savedBooks: data}},
                    {new: true, runValidators: true}
                );
            } catch (err) {
                console.log(err);
                return null;
            }
        },
        removeBook: async (parent, args, context, info) => {
            const {bookId} = args;
            const user = context.getUser();
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $pull: { savedBooks: { bookId: bookId } } },
                { new: true }
            );
            if (!updatedUser) {
                return null;
            }
            return updatedUser;
        },
    }
}