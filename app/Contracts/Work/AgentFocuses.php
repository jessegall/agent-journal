<?php

declare(strict_types=1);

namespace App\Contracts\Work;

use App\Support\ActorIdentity;
use App\Support\RecordIdentity;
use PhpOption\Option;

/**
 * What each agent focuses on, one record at a time: the work its state stack holds on top.
 */
interface AgentFocuses
{
    /**
     * Moves the agent's focus to the record; a record already in its focus is left as it is.
     */
    public function focus(ActorIdentity $agent, Focusable $focusable): void;

    /**
     * Takes the record out of the agent's focus; an agent focused on something else is left as it is.
     */
    public function unfocus(ActorIdentity $agent, Focusable $focusable): void;

    /**
     * The record the agent focuses on; none when it focuses on nothing.
     *
     * @return Option<RecordIdentity>
     */
    public function focusOf(ActorIdentity $agent): Option;

    /**
     * The agent focusing on each of the records, keyed by the record's reference; a record in no focus is left out.
     *
     * @param  list<RecordIdentity>  $records
     * @return array<string, ActorIdentity>
     */
    public function focusersOf(array $records): array;
}
