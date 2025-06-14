import { model, Schema } from "mongoose";

const profileImageCollections = [
  "notionists-neutral",
  "adventurer-neutral",
  "fun-emoji",
];

const profileImageNames = [
  "Garfield",
  "Tinkerbell",
  "Annie",
  "Loki",
  "Cleo",
  "Angel",
  "Bob",
  "Mia",
  "Coco",
  "Gracie",
  "Bear",
  "Bella",
  "Abby",
  "Harley",
  "Cali",
  "Leo",
  "Luna",
  "Jack",
  "Felix",
  "Kiki",
];

const generateDefaultProfileImage = () => {
  const collection =
    profileImageCollections[
      Math.floor(Math.random() * profileImageCollections.length)
    ];
  const name =
    profileImageNames[Math.floor(Math.random() * profileImageNames.length)];
  return `https://api.dicebear.com/6.x/${collection}/svg?seed=${name}`;
};

const userSchema = new Schema(
  {
    personal_info: {
      first_name: {
        type: String,
        required: [true, "First name is required"],
        minlength: [2, "First name must be at least 2 characters"],
        maxlength: [50, "First name cannot exceed 50 characters"],
        trim: true,
      },
      last_name: {
        type: String,
        required: [true, "Last name is required"],
        minlength: [2, "Last name must be at least 2 characters"],
        maxlength: [50, "Last name cannot exceed 50 characters"],
        trim: true,
      },
      email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
      },
      password: {
        type: String,
        required: function () {
          return !this.google_auth;
        },
        minlength: [8, "Password must be at least 8 characters"],
        maxlength: [100, "Password cannot exceed 100 characters"],
      },
      username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        minlength: [3, "Username must be at least 3 characters"],
        maxlength: [30, "Username cannot exceed 30 characters"],
        lowercase: true,
        trim: true,
        match: [
          /^[a-z0-9_-]+$/,
          "Username can only contain lowercase letters, numbers, hyphens, and underscores",
        ],
      },
      bio: {
        type: String,
        maxlength: [200, "Bio cannot exceed 200 characters"],
        default: "",
        trim: true,
      },
      profile_img: {
        type: String,
        default: generateDefaultProfileImage,
      },
    },
    social_links: {
      youtube: { type: String, default: "", trim: true },
      instagram: { type: String, default: "", trim: true },
      facebook: { type: String, default: "", trim: true },
      twitter: { type: String, default: "", trim: true },
      github: { type: String, default: "", trim: true },
      website: { type: String, default: "", trim: true },
    },
    account_info: {
      total_posts: { type: Number, default: 0, min: 0 },
      total_reads: { type: Number, default: 0, min: 0 },
    },
    google_auth: {
      type: Boolean,
      default: false,
    },
    blogs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
  },
  {
    timestamps: {
      createdAt: "joinedAt",
    },
  }
);

// Indexes for better performance
userSchema.index({ google_auth: 1 });

export default model("User", userSchema);
