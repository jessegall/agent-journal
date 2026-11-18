# Sequences

## What a sequence is

A sequence is a list of steps an agent follows one at a time. A run of a sequence knows its steps, the step it is on, and whether it is running, finished or cancelled.

## Following a run

Starting a run sets the agent and session that follow it, and from then on only that agent reads it; the run stays with it through its tasks until its last step is done. While it runs, your stack holds the step you are on: finish that step before the next one. A run that is missing or not yours answers as not found.
