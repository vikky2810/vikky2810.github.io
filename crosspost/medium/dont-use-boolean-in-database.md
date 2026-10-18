<!--
Medium draft for https://vikky2810.github.io/blog/dont-use-boolean-in-database/

Easiest route: https://medium.com/p/import -> paste the URL above -> Import.
Medium pulls the post in and sets the canonical link back to your site, so
Google credits the original. Then check the code blocks, add the tags, publish.

Manual route: new story, paste the title/subtitle/body below, upload the banner
(src/assets/dont-use-boolean-in-database-banner.jpg), then
Story settings -> Advanced settings -> "This story was originally published
elsewhere" -> paste the URL above.

Tags (max 5): Database, SQL, Software Development, Programming, Backend Development
-->

# Don't Use Boolean Values in Your Database

*isPaid works until a payment is pending, refunded or half paid.*

![Pam from The Office holding up a cardboard sign that says Please Don't](https://vikky2810.github.io/src/assets/dont-use-boolean-in-database-banner.jpg)

> Disclaimer: I am not an expert-level software engineer. I am still learning and sharing what I know.

After reading the title, the first question that comes to your mind is: why??

So let me try to answer that.

First, let's understand what happens when we put boolean values in a production database. A junior developer won't see any problem with it. But when a senior developer sees it, they will ask one question:

> "What if, instead of true and false, we get a third situation?"

## An Example: isPaid

Imagine you are tracking `isPaid`, which can be either `true` or `false`.

- `true` means paid
- `false` means unpaid

That's great. But what if the payment is pending? What if the payment is refunded? What if only half the amount is paid? Then what?

Then you start adding more columns like `isPending`, `isFailed`, `isRefunded`, and so on. You just wanted to track one payment, and now you have 4 boolean columns for a single thing.

And it gets worse. What if `isPaid` is true and `isRefunded` is also true? Was the payment paid or refunded? Now your database is telling you two different stories, and you have no idea which one is correct.

That's why booleans are a terrible idea for things like this.

## The Fix: One Status Column

So what is the solution? It's simple: use a single `payment_status` column with values like `unpaid`, `pending`, `paid`, `partially_paid`, `refunded`, and `failed`.

Instead of this:

```sql
is_paid     BOOLEAN,
is_pending  BOOLEAN,
is_failed   BOOLEAN,
is_refunded BOOLEAN
```

Do this:

```sql
payment_status VARCHAR(20) NOT NULL DEFAULT 'unpaid'
  CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'partially_paid', 'refunded', 'failed'))
```

One column. One clear answer. And if tomorrow you need a new state, you just add a new value instead of a new column.

The `CHECK` constraint also means the database itself rejects a typo like `'payed'`. It's the same idea from [SQL vs NoSQL: how I actually decide](https://vikky2810.github.io/blog/sql-vs-nosql/): let the database enforce the shape of your data.

## When a Boolean Is Fine

Sure, if you only have a dark and a light theme and you want a toggle option, then a boolean is totally fine there.

**So the simple rule is: if it's a switch (on/off), use a boolean. If it's a status that can change over time, don't.**

---

*Originally published at [vikky2810.github.io](https://vikky2810.github.io/blog/dont-use-boolean-in-database/).*
