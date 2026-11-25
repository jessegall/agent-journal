<?php

declare(strict_types=1);

namespace App\Commands\Agents\RecordHeartbeat;

use App\Attributes\Authorize;
use App\Attributes\Effect;
use App\Enums\Agents\AccessType;
use App\Enums\Engine\CommandEffectType;
use App\Policies\AgentPolicy;
use App\Support\Command;

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
