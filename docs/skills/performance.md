# Skill read budgets

Budgets count queries and models, never time.

A refresh that changes nothing (`RefreshSkillsHandler::handle`, its `#[ReadBudget]`) runs 11 queries whatever the
number of skills and sessions: the stored skills are read in one batch of up to 1,000, the running sessions in one of up
to 500 with their agents in one query, and their newest publications in one. It loads two models per stored skill
(the skill and its current revision), three per running session (session, agent, newest publication) and the newest
generation. Intents for changed sessions read their open and delivered publications in two queries for all of them.

`tests/Feature/Skills/RefreshReadBudgetTest.php` proves it with 10 and with 1,000 stored skills and 100 sessions.
