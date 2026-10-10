"use client";

import { useEffect, useState } from "react";
import {
  ApiError,
  deleteBoardNote,
  getAdminSession,
  getBoardNotes,
  getStoreApiUrl,
  postBoardNote,
} from "@/lib/api";
import { Button, buttonVariants } from "@/components/ui/button";
import type { BoardNote } from "@/lib/types";

const HELP_LINE = "For Help, click Help Topics on the Help Menu.";

function formatWhen(value: string) {
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return value;
  }
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
}

export function StatusBoard() {
  const apiUrl = getStoreApiUrl();
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState<BoardNote[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [ticker, setTicker] = useState(0);

  const messages = notes
    .map((note) => note.message.trim())
    .filter(Boolean);
  const statusText = messages.length
    ? messages[ticker % messages.length]
    : HELP_LINE;

  useEffect(() => {
    if (!apiUrl) {
      return;
    }
    let live = true;
    getBoardNotes()
      .then((next) => {
        if (live) {
          setNotes(next);
        }
      })
      .catch(() => {
        if (live) {
          setNotes([]);
        }
      });
    getAdminSession()
      .then((session) => {
        if (live) {
          setIsAdmin(Boolean(session.admin));
        }
      })
      .catch(() => {
        if (live) {
          setIsAdmin(false);
        }
      });
    return () => {
      live = false;
    };
  }, [apiUrl]);

  useEffect(() => {
    if (open || messages.length < 2) {
      return;
    }
    const timer = window.setInterval(() => {
      setTicker((current) => current + 1);
    }, 4000);
    return () => {
      window.clearInterval(timer);
    };
  }, [open, messages.length]);

  async function reloadBoard() {
    const next = await getBoardNotes();
    setNotes(next);
    return next;
  }

  async function onPost() {
    setPending("post");
    setError(null);
    try {
      await postBoardNote(draft);
      setDraft("");
      await reloadBoard();
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : caught instanceof Error ? caught.message : "Could not post.");
    } finally {
      setPending(null);
    }
  }

  async function onRemove(id: number) {
    setPending(`remove-${id}`);
    setError(null);
    try {
      await deleteBoardNote(id);
      await reloadBoard();
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : caught instanceof Error ? caught.message : "Could not remove that note.");
    } finally {
      setPending(null);
    }
  }

  if (!apiUrl) {
    return (
      <div className="win-status bg-[#ece9d8]">
        <div className="win-status-cell">{HELP_LINE}</div>
      </div>
    );
  }

  return (
    <div className="relative bg-[#ece9d8]">
      {open ? (
        <div
          id="board-panel"
          className="absolute right-1 bottom-full left-1 z-20 mb-1 max-h-[min(360px,50vh)] overflow-hidden border-2 border-[#fff] border-r-[#000] border-b-[#000] bg-[#ece9d8] shadow-[inset_-1px_-1px_0_#808080,inset_1px_1px_0_#dfdfdf]"
        >
          <div className="win-titlebar px-2">
            <span className="min-w-0 flex-1 truncate text-[12px] tracking-normal">Notes</span>
            <button
              type="button"
              className="inline-flex size-[18px] items-center justify-center border border-[#fff] border-r-[#000] border-b-[#000] bg-[#e81123] text-[11px] font-bold leading-none text-white"
              aria-label="Close"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>
          <div className="space-y-2 p-2">
            <div className="paint-scroll win-sunken max-h-[180px] overflow-auto bg-white p-1">
              {notes.length === 0 ? (
                <p className="px-1 py-2 text-[12px]">No notes yet.</p>
              ) : (
                <ul className="space-y-1">
                  {notes.map((note) => (
                    <li
                      key={note.id}
                      className="flex items-start justify-between gap-2 border-b border-[#dfdfdf] px-1 py-1 text-[12px] last:border-b-0"
                    >
                      <div className="min-w-0">
                        <p className="whitespace-pre-wrap break-words text-black">{note.message}</p>
                        <p className="text-[11px] text-[#808080]">{formatWhen(note.created_at)}</p>
                      </div>
                      {isAdmin ? (
                        <Button
                          type="button"
                          size="xs"
                          variant="destructive"
                          disabled={pending === `remove-${note.id}`}
                          onClick={() => void onRemove(note.id)}
                        >
                          {pending === `remove-${note.id}` ? "…" : "Remove"}
                        </Button>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {error ? <p className="text-[12px] text-[#800000]">{error}</p> : null}
            <textarea
              id="board-note"
              maxLength={240}
              rows={3}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              className="win-sunken min-h-16 w-full rounded-none bg-white px-1.5 py-1 text-[12px] text-black outline-none"
              aria-label="Write a note"
            />
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-[#808080]">{draft.length}/240</span>
              <button
                type="button"
                className={buttonVariants()}
                disabled={pending === "post"}
                onClick={() => void onPost()}
              >
                {pending === "post" ? "Posting…" : "Post"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <div className="win-status bg-[#ece9d8]">
        <button
          type="button"
          className="win-status-cell w-full cursor-pointer text-left"
          aria-expanded={open}
          aria-controls="board-panel"
          aria-live="polite"
          onClick={() => setOpen((value) => !value)}
          title={statusText}
        >
          {statusText}
        </button>
      </div>
    </div>
  );
}
