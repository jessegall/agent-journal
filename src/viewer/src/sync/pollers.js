// Every poller the viewer runs, declared once here and nowhere else, and never at runtime: its key, what it reads from the
// params its users hand it, and how often in milliseconds (or a function of the moment). One that runs per agent or per row
// names in `by` the part of its params that tells one run from another. One the whole app holds keeps its answer in the
// store with `take`. Any poller may declare `active`, which says whether it is asked now.
export const POLLERS = Object.freeze({
    "outbox.retry": {read: ({retry}) => retry(), every: 5000},
});
