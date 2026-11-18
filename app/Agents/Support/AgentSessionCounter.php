<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Actors\Contracts\ActiveActorCounter;
use App\Actors\Enums\ActorType;
use App\Actors\Support\PresenceWindow;
use App\Agents\Models\AgentSession;
use Carbon\CarbonImmutable;

/**
 * Counts the present agent sessions in one count query; two present sessions of one agent count two.
 */
final readonly class AgentSessionCounter implements ActiveActorCounter
{
    public function __construct(private PresenceWindow $window) {}

    public static function type(): ActorType
    {
        return ActorType::Agent;
    }

    public function count(CarbonImmutable $observedAt): int
    {
        return AgentSession::query()->present($observedAt, $this->window)->count();
    }
}
