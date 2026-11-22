<?php

declare(strict_types=1);

namespace App\Support;

use App\Models\Agent;
use App\Models\AgentChatInviter;
use App\Models\AgentChatPermission;
use App\Values\ProfileBase;
use Illuminate\Database\Eloquent\Builder;

/**
 * Which agents a user may bring into a chat of one environment: an active agent whose profile permits chats, which
 * its operator allowed there, naming that very user among its inviters.
 */
final readonly class AgentChatAdmission
{
    /**
     * Holds the agent's permission row for the environment under its lock, the first lock an agent's enrollment takes.
     */
    public function lockPermission(ActorIdentity $agent, string|null $environmentId): void
    {
        Agent::query()->whereKey($agent->id)->lockForUpdate()->first();
        AgentChatPermission::query()->activeFor($agent->id, $environmentId)->lockForUpdate()->first();
    }

    public function mayJoin(ActorIdentity $agent, ActorIdentity $inviter, string|null $environmentId): bool
    {
        if (! $agent->type->isAgent() || ! $inviter->type->isUser()) {
            return false;
        }

        return $this->invitable($inviter, $environmentId)->whereKey($agent->id)->exists();
    }

    /**
     * The ids of the agents the inviter may bring into chats of the environment, at most the given number.
     *
     * @return list<string>
     */
    public function invitableAgentIds(ActorIdentity $inviter, string|null $environmentId, int $limit): array
    {
        if (! $inviter->type->isUser()) {
            return [];
        }

        return array_values(array_map(
            strval(...),
            $this->invitable($inviter, $environmentId)->orderBy('name')->limit($limit)->pluck('id')->all(),
        ));
    }

    /**
     * @return Builder<Agent>
     */
    private function invitable(ActorIdentity $inviter, string|null $environmentId): Builder
    {
        $permitted = AgentChatPermission::query()
            ->inEnvironment($environmentId)
            ->where('allows_participation', true)
            ->whereIn('id', AgentChatInviter::query()->where('user_id', $inviter->id)->select('permission_id'))
            ->select('agent_id');

        return Agent::query()
            ->whereNull('retired_at')
            ->whereIn('profile_key', ProfileBase::chatProfileKeys())
            ->whereIn('id', $permitted);
    }
}
