import settings from "./documents/settings";
import tag from "./documents/directory/tag";
import group from "./documents/directory/group";
import category from "./documents/directory/category";
import collection from "./documents/directory/collection";
import user from "./documents/auth/user";
import account from "./documents/auth/account";
import verificationToken from "./documents/auth/verification-token";
import passwordResetToken from "./documents/auth/password-reset-token";
import blogCategory from "./documents/blog/blog-category";
import blogPost from "./documents/blog/blog-post";
import blockContent from "./documents/block-content";
import page from "./documents/page/page";
import order from "./documents/order/order";
import item from "./documents/directory/item";
import subscriber from "./documents/newsletter/subscriber";

export const schemaTypes = [
  settings,
  tag,
  group,
  category,
  collection,
  user,
  account,
  verificationToken,
  passwordResetToken,
  blogCategory,
  blogPost,
  blockContent,
  page,
  item,
  order,
  subscriber,
];
