const { User } = require("../models");

const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, { username }) => {
      return User.findOne({ username })
      .select("-__v -password")
    },
  },

  Mutation: {
    createUser: async (parent, args) => {
      const user = await User.create(args);
      
      const token = signToken(user);

      return { token, user };
    },
    login: async (partent, args) => {
      const user = await User.findOne({ $or: [{ username: args.username }, {email: args.email}]})

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(args.password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }     

      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (parent, { user, args }) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user.id },
          { $addToSet: { savedBooks: args } },
          { new: true, runValidators: true }
        );
        return updatedUser
      } catch (err) {
        console.error(err);
      };
    },
    deleteBook: async (parent, { user, args }) =>{
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $pull: { savedBooks: { bookId: args.bookId } } },
        { new: true}
      )
      if (!updatedUser) {
        console.error("No user found")
      }
      return updatedUser
    }
  }
};

module.exports = resolvers;