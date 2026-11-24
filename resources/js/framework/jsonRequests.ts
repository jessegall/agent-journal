import { xsrfToken } from "@/echo";

// The client for the journal's machine streams only, today the terminal's control: a page reads and changes its data
// through Inertia (page actions and partial reloads), never through this.

/**
 * Why a JSON request failed: the server refused it with a code and message, or no answer came, so nothing is known.
 */
export class JsonRequestFailed extends Error {
  constructor(
    readonly kind: "refused" | "lost",
    readonly status: number,
    readonly code: string,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
  }

  /**
   * The request never reached the journal, or its answer never came back.
   */
  static unanswered(cause: unknown): JsonRequestFailed {
    return new JsonRequestFailed("lost", 0, "", "No answer came from the journal.", { cause });
  }

  /**
   * The journal took the request and failed on its side.
   */
  static failedOnServer(status: number): JsonRequestFailed {
    return new JsonRequestFailed("lost", status, "", "The journal could not answer.");
  }

  /**
   * The journal refused the request, with its own code and reason when it gave them.
   */
  static refused(status: number, code: string | undefined, reason: string | undefined): JsonRequestFailed {
    return new JsonRequestFailed("refused", status, code ?? "", reason ?? "The journal refused the request.");
  }
}

/**
 * Reads JSON from a route of the journal, with the session's cookies; an abort signal cancels it.
 */
export async function fetchJson<Answer>(
  url: string,
  signal?: AbortSignal,
): Promise<Answer> {
  return (await requestJson(url, { method: "GET", signal })) as Answer;
}

/**
 * Posts JSON to a route of the journal and reads its answer; an answer with no content reads as null.
 */
export async function postJson<Answer>(
  url: string,
  body: object,
  signal?: AbortSignal,
): Promise<Answer | null> {
  return (await requestJson(url, {
    method: "POST",
    body: JSON.stringify(body),
    signal,
  })) as Answer | null;
}

async function requestJson(url: string, init: RequestInit): Promise<unknown> {
  let response: Response;

  try {
    response = await fetch(url, {
      credentials: "same-origin",
      ...init,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-XSRF-TOKEN": xsrfToken(),
      },
    });
  } catch (failure) {
    if (failure instanceof DOMException && failure.name === "AbortError") {
      throw failure;
    }

    throw JsonRequestFailed.unanswered(failure);
  }

  if (response.status >= 500) {
    throw JsonRequestFailed.failedOnServer(response.status);
  }

  if (!response.ok) {
    const refusal = (await response.json().catch(() => ({}))) as {
      code?: string;
      message?: string;
    };

    throw JsonRequestFailed.refused(response.status, refusal.code, refusal.message);
  }

  if (response.status === 204) {
    return null;
  }

  return await response.json();
}
