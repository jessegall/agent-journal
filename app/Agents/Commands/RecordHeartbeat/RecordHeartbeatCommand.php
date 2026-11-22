<?php

declare(strict_types=1);

namespace App\Agents\Commands\RecordHeartbeat;

use App\Agents\Policies\AgentPolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\Effect;
use App\Bus\Enums\CommandEffectType;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * Records a heartbeat of a running session at the database server's time; an ended, revoked or retired one is refused.
 *
 * @extends Command<null>
 */
#[Effect(CommandEffectType::Recovery)]
#[Authorize(AgentPolicy::class, AccessType::Edit)]
final readonly class RecordHeartbeatCommand extends Command
{
    public function __construct(public string $sessionId) {}
}
