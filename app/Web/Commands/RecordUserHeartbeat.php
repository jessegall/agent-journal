<?php

declare(strict_types=1);

namespace App\Web\Commands;

use App\Actors\Models\UserPresence;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Web\Enums\PresenceAbility;
use App\Web\Handlers\RecordUserHeartbeatHandler;
use App\Web\Policies\PresencePolicy;

/**
 * Records a heartbeat of the calling user at the database server's time; the user comes from the current actor.
 *
 * @extends Command<null>
 */
#[HandledBy(RecordUserHeartbeatHandler::class)]
#[Authorize(PresencePolicy::class, PresenceAbility::Work)]
#[Operation('record_user_heartbeat', ResourceAreaType::JournalControl, AccessType::Edit)]
final readonly class RecordUserHeartbeat extends Command implements AuthorizedCommand
{
    /**
     * @return class-string
     */
    public function subject(): string
    {
        return UserPresence::class;
    }
}
