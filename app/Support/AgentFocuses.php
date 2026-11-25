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
    public function focus(ActorReference $agent, Focusable $focusable): void
    {
        $focusable->assertFocusable();
        AgentFocus::create($agent->id)->moveTo($focusable->focusIdentity());
    }

    public function unfocus(ActorReference $agent, Focusable $focusable): void
    {
        AgentFocus::create($agent->id)->clear($focusable->focusIdentity());
    }

    public function focusOf(ActorReference $agent): Option
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
            $focusers[$focus->record->reference()] = ActorReference::ofClass(Agent::class, $focus->agent_id);
        }

        return $focusers;
    }
}
