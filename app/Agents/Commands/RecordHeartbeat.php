<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Handlers\RecordHeartbeatHandler;
use App\Agents\Policies\AgentPolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\Effect;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEffectType;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * Records a heartbeat of a running session at the database server's time; an ended, revoked or retired one is refused.
 *
 * @extends Command<null>
 */
#[Effect(CommandEffectType::Recovery)]
#[HandledBy(RecordHeartbeatHandler::class)]
#[Authorize(AgentPolicy::class, AccessType::Edit)]
final readonly class RecordHeartbeat extends Command
{
    public function __construct(public string $sessionId) {}
}
