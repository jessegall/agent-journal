<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Enums\AgentAbility;
use App\Agents\Handlers\RecordHeartbeatHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;

/**
 * Records a heartbeat of a running session at the database server's time; an ended, revoked or retired one is refused.
 *
 * @extends Command<null>
 */
#[HandledBy(RecordHeartbeatHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::Work)]
final readonly class RecordHeartbeat extends Command implements HasAuthorizationSubject
{
    public function __construct(public string $sessionId) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Agent::class;
    }
}
