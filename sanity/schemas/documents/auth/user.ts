import { format, parseISO } from "date-fns";
import { defineField, defineType } from "sanity";

const user = defineType({
  name: "user",
  title: "User",
  type: "document",
  groups: [
    {
      name: "stripe",
      title: "Stripe",
    },
  ],
  fields: [
    defineField({
      name: "name",
      title: "User Name",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "User Email",
      type: "string",
    }),
    defineField({
      name: "emailVerified",
      title: "Email Verification",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "image",
      title: "User Image",
      type: "string",
    }),
    defineField({
      name: "link",
      title: "User Link",
      type: "string",
    }),
    defineField({
      name: "password",
      title: "User Password",
      type: "string",
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      initialValue: "USER",
      options: {
        list: ["ADMIN", "USER"],
      },
    }),
    defineField({
      name: "provider",
      title: "Auth Provider",
      type: "string",
      description: "OAuth provider (google, github, credentials)",
      options: {
        list: ["credentials", "google", "github"],
      },
    }),
    defineField({
      name: "providerId",
      title: "Provider ID",
      type: "string",
      description: "User ID from OAuth provider",
      hidden: true,
    }),
    defineField({
      name: "accounts",
      title: "Accounts",
      type: "reference",
      to: [{ type: "account" }],
    }),
    // stripe
    defineField({
      name: "stripeCustomerId",
      title: "Stripe Customer Id",
      type: "string",
      group: "stripe",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      id: "_id",
      name: "name",
      date: "_createdAt",
    },
    prepare({ id, name, date }) {
      const title = name;
      // get simple user id by concating the first 4 and last 4 characters
      const userid = `${id.substring(5, 9)}...${id.substring(id.length - 4)}`;
      const subtitle = `${format(parseISO(date), "yyyy/MM/dd")}-${userid}`;
      return {
        title,
        subtitle,
      };
    },
  },
});

export default user;
