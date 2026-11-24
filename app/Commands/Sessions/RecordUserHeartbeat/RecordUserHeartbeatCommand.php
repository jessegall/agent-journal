<?php

declare(strict_types=1);

namespace App\Commands\Sessions\RecordUserHeartbeat;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Policies\PresencePolicy;
use App\Support\Command;

/**
 * Records a heartbeat of the calling user at the database server's time; the user comes from the current actor.
 *
 * @extends Command<null>
 */
#[Authorize(PresencePolicy::class, AccessType::Edit)]
final readonly class RecordUserHeartbeatCommand extends Command {}
