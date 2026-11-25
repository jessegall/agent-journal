<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Work\AgentFocuses as AgentFocusesContract;
use App\Contracts\Work\Focusable;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentFocus;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * Each agent's focus kept in its own row, so a focused record holds nothing of the agents that focus on it.
 */
final readonly class AgentFocuses implements AgentFocusesContract
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
        $focus = AgentFocus::query()->ofAgent($agent->id)->first();

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
            $focusers[$focus->record->reference()] = ActorIdentity::ofClass(Agent::class, $focus->agent_id);
        }

        return $focusers;
    }
}
