<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Work\AgentFocuses;
use App\Contracts\Work\Focusable;
use App\Enums\ActorType;
use App\Models\Agents\AgentFocus;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * Each agent's focus kept in its own row, so a focused record holds nothing of the agents that focus on it.
 */
final readonly class StoredAgentFocuses implements AgentFocuses
{
    public function focus(ActorIdentity $agent, Focusable $focusable): void
    {
        $focusable->assertFocusable();
        AgentFocus::lockedFor($agent->id)->moveTo($focusable->focusIdentity());
    }

    public function unfocus(ActorIdentity $agent, Focusable $focusable): void
    {
        AgentFocus::lockedFor($agent->id)->clear($focusable->focusIdentity());
    }

    public function focusOf(ActorIdentity $agent): Option
    {
        $focus = AgentFocus::query()->where('agent_id', $agent->id)->first();

        if ($focus === null) {
            return None::create();
        }

        return new Some($focus->record);
    }

    public function focusersOf(array $records): array
    {
        if ($records === []) {
            return [];
        }

        $focusers = [];

        foreach (AgentFocus::query()->onRecords($records)->limit(count($records))->get() as $focus) {
            $focusers[$focus->record->reference()] = new ActorIdentity(ActorType::Agent, $focus->agent_id);
        }

        return $focusers;
    }
}
