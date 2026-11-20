<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Enums\AgentAbility;
use App\Agents\Handlers\RecordHeartbeatHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\Effect;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Enums\CommandEffectType;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;

/**
 * Records a heartbeat of a running session at the database server's time; an ended, revoked or retired one is refused.
 *
 * @extends Command<null>
 */
#[Effect(CommandEffectType::Recovery)]
#[HandledBy(RecordHeartbeatHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::Work)]
#[Operation('record_heartbeat', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class RecordHeartbeat extends Command implements AuthorizedCommand
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
