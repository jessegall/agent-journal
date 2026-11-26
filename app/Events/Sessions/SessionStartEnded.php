<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Sessions\Contracts\SessionStartEvent;
use App\Support\RecordIdentity;

/**
 * The session an owner started for its work ended: an exit, a lost heartbeat or a stop. It says nothing about
 * whether the work is done; only a certified stop does. Raised after the transaction committed, for the owner.
 */
final readonly class SessionStartEnded implements SessionEvent, SessionStartEvent
{
    public function __construct(public RecordIdentity $work) {}
}
