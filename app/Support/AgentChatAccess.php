<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Chat\ChatParticipationEnding;
use App\Enums\ActorType;
use App\Models\AgentChatInviter;
use App\Models\AgentChatPermission;
use Carbon\CarbonImmutable;
use Illuminate\Database\ConnectionInterface;

/**
 * An operator's say over an agent in chats: allowing it in an environment with the users who may invite it, and
 * withdrawing that, which ends its part in every chat there in the same transaction. Its other chats and desk mail
 * stay as they are.
 */
final readonly class AgentChatAccess
{
    public function __construct(
        private ConnectionInterface $database,
        private ChatParticipationEnding $chats,
    ) {}

    /**
     * @param  list<string>  $inviterIds
     */
    public function allow(
        string $agentId,
        string|null $environmentId,
        array $inviterIds,
        ActorIdentity $operator,
        CarbonImmutable $at,
    ): AgentChatPermission {
        return $this->database->transaction(function () use ($agentId, $environmentId, $inviterIds, $operator, $at) {
            AgentChatPermission::query()->activeFor($agentId, $environmentId)->first()?->withdraw($at);
            $permission = AgentChatPermission::create($agentId, $environmentId, $operator, $at);

            foreach (array_unique($inviterIds) as $userId) {
                AgentChatInviter::create($permission->id, $userId);
            }

            return $permission;
        });
    }

    public function withdraw(string $agentId, string|null $environmentId, CarbonImmutable $at): void
    {
        $this->database->transaction(function () use ($agentId, $environmentId, $at): void {
            $permission = AgentChatPermission::query()->activeFor($agentId, $environmentId)->lockForUpdate()->first();

            if ($permission === null) {
                return;
            }

            $permission->withdraw($at);
            $this->chats->endInEnvironment(new ActorIdentity(ActorType::Agent, $agentId), $environmentId);
        });
    }
}
