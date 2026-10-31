// Whether the figure counts as in the chat for an arrival or a departure: one making its exit is already on its way out, so an
// arrival then turns it back rather than being taken for one already there.
export const isPresent = (body) => body.here && !body.leaving;
