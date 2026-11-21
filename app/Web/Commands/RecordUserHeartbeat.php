<?php

declare(strict_types=1);

namespace App\Web\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Web\Policies\PresencePolicy;

/**
 * Records a heartbeat of the calling user at the database server's time; the user comes from the current actor.
 *
 * @extends Command<null>
 */
#[Authorize(PresencePolicy::class, AccessType::Edit)]
final readonly class RecordUserHeartbeat extends Command {}
