import Book from '../models';
import User from '../models/User';
import { signToken, AuthenticationError } from '../services/auth';

interface Book {
    bookID: string;
    authors: string[];
    description: string;
    title: string;
    image: string;
    link: string;
}

interface User {
    _id: string;
    username: string;
    email: string;
    password: string;
    bookCount: number;
    savedBooks: Book[];
}

interface loginArgs {
    email: string;
    password: string;
}

interface addUserArgs {
    username: string;
    email: string;
    password: string;
}

interface saveBookArgs {
    input: {
        bookID: string;
        description: string;
        title: string;
        image: string;
        link: string;
    }
}

interface removeBookArgs {
    bookID: string;
}

interface Context {
    user?: User;
}

const resolvers = {

    Query: {
        me: async (_parent: any, _args: any, context: Context) => {
            if (context.user) {
                const user = await User.findById(context.user._id).populate('savedBooks');
                return user;
            }
            throw new AuthenticationError('Not logged in');
        }
    },
    Mutation: {
        login: async (_parent: any, { email, password}: loginArgs) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }
            const correctPassword = await user.isCorrectPassword(password);
            if (!correctPassword) {
                throw new AuthenticationError('Incorrect credentials');
            }
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },
        addUser: async (_parent: any, { username, email, password }: addUserArgs) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },
        saveBook: async (_parent: any, { input }: saveBookArgs, context: Context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    context.user._id,
                    { $addToSet: { savedBooks: input } },
                    { new: true, runValidators: true }
                ).populate('savedBooks');
                return updatedUser;
            }
            throw new AuthenticationError('Not logged in');
        },
        removeBook: async (_parent: any, { bookID }: removeBookArgs, context: Context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookID } } },
                    { new: true }
                ).populate('savedBooks');
                return updatedUser;
            }
            throw new AuthenticationError('Not logged in');
        },
    },
};

export default resolvers;