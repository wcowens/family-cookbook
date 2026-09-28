"use client";

import { useActionState } from "react";
import { inviteToBook, updateBookTheme, type BookFormState } from "@/app/books/actions";
import { BookColorFields } from "@/components/book-color-fields";
import type { BookMember } from "@/lib/books";

const initialState: BookFormState = {};

export function BookSettings({
  bookId,
  theme,
  coverColor,
  paperColor,
  accentColor,
  members,
}: {
  bookId: string;
  theme: string;
  coverColor: string;
  paperColor: string;
  accentColor: string;
  members: BookMember[];
}) {
  const [inviteState, inviteAction, invitePending] = useActionState(inviteToBook, initialState);
  const [themeState, themeAction, themePending] = useActionState(updateBookTheme, initialState);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <form action={inviteAction} className="card space-y-4">
        <h2 className="font-serif text-2xl">Invite someone</h2>
        <p className="text-muted">
          If they already have an account, they join now. Otherwise they join when they sign up with this email.
        </p>
        <input type="hidden" name="bookId" value={bookId} />
        {inviteState.error ? (
          <p className="rounded-2xl bg-terracotta/10 px-4 py-3 text-terracotta" role="alert">
            {inviteState.error}
          </p>
        ) : null}
        {inviteState.message ? (
          <p className="rounded-2xl bg-olive/10 px-4 py-3 text-olive" role="status">
            {inviteState.message}
          </p>
        ) : null}
        <div className="space-y-2">
          <label htmlFor="invite-email" className="field-label">
            Email
          </label>
          <input id="invite-email" name="email" type="email" required className="field-input" />
        </div>
        <button type="submit" className="btn-primary" disabled={invitePending}>
          {invitePending ? "Inviting..." : "Invite"}
        </button>
        <ul className="space-y-2 text-sm">
          {members.map((member) => (
            <li key={member.id} className="flex items-center justify-between gap-3">
              <span>{member.email}</span>
              <span className="text-muted">
                {member.role === "owner" ? "Creator" : member.status === "pending" ? "Waiting to sign up" : "Joined"}
              </span>
            </li>
          ))}
        </ul>
      </form>

      <form action={themeAction} className="card space-y-4">
        <h2 className="font-serif text-2xl">Book colors</h2>
        <p className="text-muted">Everyone in this book sees these colors.</p>
        <input type="hidden" name="bookId" value={bookId} />
        {themeState.error ? (
          <p className="rounded-2xl bg-terracotta/10 px-4 py-3 text-terracotta" role="alert">
            {themeState.error}
          </p>
        ) : null}
        {themeState.message ? (
          <p className="rounded-2xl bg-olive/10 px-4 py-3 text-olive" role="status">
            {themeState.message}
          </p>
        ) : null}
        <BookColorFields
          theme={theme}
          coverColor={coverColor}
          paperColor={paperColor}
          accentColor={accentColor}
        />
        <button type="submit" className="btn-primary" disabled={themePending}>
          {themePending ? "Saving..." : "Save colors"}
        </button>
      </form>
    </div>
  );
}
