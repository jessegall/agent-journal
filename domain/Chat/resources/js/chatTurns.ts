/**
 * Groups the rows of a chat into turns, as the design spaces them: everything an agent does in one turn in a row (its
 * steps, the commands and cards that belong to whichever agent is acting, and its answer) is one group, drawn closer
 * together than the gap between groups; every other row, such as your own message, is a group of its own.
 */

/** The key of a row that belongs to whichever agent is acting, such as a command or a record card. */
export const ACTING_AGENT = "agent";

/**
 * @param turnOf  the agent whose turn a row belongs to, ACTING_AGENT for a row of whichever agent is acting, or null
 *                for a row that is no part of a turn
 * @param startsAnew  whether a row always opens a new group, such as the first row of a day
 */
export function groupTurns<Row>(
  rows: Row[],
  turnOf: (row: Row) => string | null,
  startsAnew: (row: Row) => boolean,
): Row[][] {
  const groups: Row[][] = [];
  let turn: Row[] = [];
  let agent: string | null = null;

  const close = (): void => {
    if (turn.length > 0) {
      groups.push(turn);
    }

    turn = [];
    agent = null;
  };

  rows.forEach((row) => {
    const key = turnOf(row);

    if (key === null) {
      close();
      groups.push([row]);

      return;
    }

    const named = key === ACTING_AGENT ? null : key;
    const isAnotherAgent = named !== null && agent !== null && named !== agent;

    if (startsAnew(row) || isAnotherAgent) {
      close();
    }

    turn.push(row);
    agent = named ?? agent;
  });
  close();

  return groups;
}
