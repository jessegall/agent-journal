<?php

declare(strict_types=1);

namespace App\Sessions\Commands\RecordUserHeartbeat;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\PresencePolicy;
use App\Support\Command;

/**
 * Records a heartbeat of the calling user at the database server's time; the user comes from the current actor.
 *
 * @extends Command<null>
 */
#[Authorize(PresencePolicy::class, AccessType::Edit)]
final readonly class RecordUserHeartbeatCommand extends Command {}
