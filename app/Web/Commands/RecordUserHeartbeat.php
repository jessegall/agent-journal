<?php

declare(strict_types=1);

namespace App\Web\Commands;

use App\Actors\Models\UserPresence;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Web\Enums\PresenceAbility;
use App\Web\Handlers\RecordUserHeartbeatHandler;
use App\Web\Policies\PresencePolicy;

/**
 * Records a heartbeat of the calling user at the database server's time; the user comes from the current actor.
 *
 * @implements Command<null>
 */
#[HandledBy(RecordUserHeartbeatHandler::class)]
#[Authorize(PresencePolicy::class, PresenceAbility::Work)]
final readonly class RecordUserHeartbeat implements Command, HasAuthorizationSubject
{
    /**
     * @return class-string
     */
    public function subject(): string
    {
        return UserPresence::class;
    }
}
