import { format, parseISO } from "date-fns";
import { defineField, defineType } from "sanity";

/**
 * Newsletter Subscriber Schema
 * 
 * Stores email subscribers for the newsletter.
 * Subscribers can be managed in Sanity Studio.
 */
const subscriber = defineType({
  name: "subscriber",
  title: "Newsletter Subscriber",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "active",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Unsubscribed", value: "unsubscribed" },
          { title: "Bounced", value: "bounced" },
        ],
      },
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      description: "Where the subscriber signed up from",
      initialValue: "website",
      options: {
        list: [
          { title: "Website", value: "website" },
          { title: "Blog", value: "blog" },
          { title: "Pricing Page", value: "pricing" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField({
      name: "subscribedAt",
      title: "Subscribed At",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "unsubscribedAt",
      title: "Unsubscribed At",
      type: "datetime",
      readOnly: true,
      hidden: ({ document }) => document?.status !== "unsubscribed",
    }),
    defineField({
      name: "metadata",
      title: "Metadata",
      type: "object",
      description: "Additional subscriber information",
      fields: [
        defineField({
          name: "ip",
          title: "IP Address",
          type: "string",
        }),
        defineField({
          name: "userAgent",
          title: "User Agent",
          type: "string",
        }),
        defineField({
          name: "referrer",
          title: "Referrer",
          type: "string",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      email: "email",
      status: "status",
      date: "subscribedAt",
    },
    prepare({ email, status, date }) {
      const statusEmoji = status === "active" ? "✅" : status === "unsubscribed" ? "❌" : "⚠️";
      const subtitle = date 
        ? `${statusEmoji} ${format(parseISO(date), "yyyy/MM/dd HH:mm")}`
        : `${statusEmoji} ${status}`;
      return {
        title: email,
        subtitle,
      };
    },
  },
  orderings: [
    {
      title: "Subscribed Date (Newest)",
      name: "subscribedAtDesc",
      by: [{ field: "subscribedAt", direction: "desc" }],
    },
    {
      title: "Subscribed Date (Oldest)",
      name: "subscribedAtAsc",
      by: [{ field: "subscribedAt", direction: "asc" }],
    },
    {
      title: "Email (A-Z)",
      name: "emailAsc",
      by: [{ field: "email", direction: "asc" }],
    },
  ],
});

export default subscriber;
