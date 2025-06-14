import { model, Schema } from "mongoose";

let profile_imgs_name_list = [
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
let profile_imgs_collections_list = [
  "notionists-neutral",
  "adventurer-neutral",
  "fun-emoji",
];

const userSchema = new Schema(
  {
    personal_info: {
      first_name: {
        type: String,
        required: [true, "Tên là bắt buộc"],
        minlength: [2, "Tên phải có ít nhất 2 ký tự"],
        maxlength: [50, "Tên không được dài quá 50 ký tự"],
        match: [/^[\p{L}\s'-]+$/u, "Tên không hợp lệ"],
        trim: true,
      },
      last_name: {
        type: String,
        required: [true, "Họ và tên đệm là bắt buộc"],
        minlength: [2, "Họ và tên đệm phải có ít nhất 2 ký tự"],
        maxlength: [50, "Họ và tên đệm không được dài quá 50 ký tự"],
        match: [/^[\p{L}\s'-]+$/u, "Họ và tên đệm không hợp lệ"],
        trim: true,
      },
      email: {
        type: String,
        required: [true, "Email là bắt buộc"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, "Email không hợp lệ"],
      },
      password: {
        type: String,
        required: function () {
          return !this.google_auth;
        },
        minlength: [8, "Mật khẩu phải có ít nhất 8 ký tự"],
        maxlength: [100, "Mật khẩu không được vượt quá 100 ký tự"],
        validate: {
          validator: function (v) {
            // Skip validation if this is a Google auth user
            if (this.google_auth) {
              return true;
            }
            // Only validate if password exists
            if (!v) return false;
            return (
              /[a-z]/.test(v) &&
              /[A-Z]/.test(v) &&
              /[0-9]/.test(v) &&
              /[^a-zA-Z0-9]/.test(v)
            );
          },
          message:
            "Mật khẩu phải chứa chữ thường, chữ in hoa, số và ký tự đặc biệt",
        },
      },
      username: {
        type: String,
        minlength: [3, "Tên người dùng phải có ít nhất 3 ký tự"],
        unique: true,
      },
      bio: {
        type: String,
        maxlength: [200, "Bio không được dài quá 200 ký tự"],
        default: "",
      },
      profile_img: {
        type: String,
        default: () => {
          return `https://api.dicebear.com/6.x/${
            profile_imgs_collections_list[
              Math.floor(Math.random() * profile_imgs_collections_list.length)
            ]
          }/svg?seed=${
            profile_imgs_name_list[
              Math.floor(Math.random() * profile_imgs_name_list.length)
            ]
          }`;
        },
      },
    },
    social_links: {
      youtube: {
        type: String,
        default: "",
      },
      instagram: {
        type: String,
        default: "",
      },
      facebook: {
        type: String,
        default: "",
      },
      twitter: {
        type: String,
        default: "",
      },
      github: {
        type: String,
        default: "",
      },
      website: {
        type: String,
        default: "",
      },
    },
    account_info: {
      total_posts: {
        type: Number,
        default: 0,
      },
      total_reads: {
        type: Number,
        default: 0,
      },
    },
    google_auth: {
      type: Boolean,
      default: false,
    },
    blogs: {
      type: [Schema.Types.ObjectId],
      ref: "blogs",
      default: [],
    },
  },
  {
    timestamps: {
      createdAt: "joinedAt",
    },
  }
);

export default model("User", userSchema);
