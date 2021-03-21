const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express")

const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("_v -password")
          .populate("savedBooks");
        return userData
      }

      throw new AuthenticationError("Not logged in")
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
    saveBook: async (parent, args, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user.id },
          { $addToSet: { savedBooks: args } },
          { new: true, runValidators: true }
        );
        return updatedUser
      }
     
      throw new AuthenticationError("You need to be logged in!")
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