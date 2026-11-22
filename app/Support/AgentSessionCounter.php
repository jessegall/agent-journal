<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\ActiveActorCounter;
use App\Enums\ActorType;
use App\Models\AgentSession;
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
