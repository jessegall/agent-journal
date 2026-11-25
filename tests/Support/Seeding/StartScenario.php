<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

/**
 * A start position several tests share, made through the journal's own verbs: what it needs in place and the names it
 * makes are checked before it writes anything, and what it started comes back as its result, never kept on it.
 *
 * @template TResult
 */
interface StartScenario
{
    /**
     * The domains, named users and agents, and sessions the scenario needs in place before it writes.
     */
    public function requirements(): ScenarioRequirements;

    /**
     * The users, agents and records the scenario makes under names of its own.
     *
     * @return list<string>
     */
    public function freshNames(): array;

    /**
     * @return TResult
     */
    public function start(TestJournal $journal): mixed;
}
