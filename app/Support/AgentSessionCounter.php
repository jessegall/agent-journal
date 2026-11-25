<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\ActiveActorCounter;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use Carbon\CarbonImmutable;

/**
 * Counts the present agent sessions in one count query; two present sessions of one agent count two.
 */
final readonly class AgentSessionCounter implements ActiveActorCounter
{
    public function __construct(private PresenceWindow $window) {}

    public static function type(): string
    {
        return Agent::storedType();
    }

    public function count(CarbonImmutable $observedAt): int
    {
        return AgentSession::query()->present($observedAt, $this->window)->count();
    }
}
