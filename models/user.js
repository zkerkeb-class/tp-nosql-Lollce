import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        favorites: { type: [Number], default: [] },
    },
    { timestamps: true }
);

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
});

const User = mongoose.model('User', userSchema);

export default User;
