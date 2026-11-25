<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Sessions\SessionStartEvent;
use App\Support\RecordIdentity;

/**
 * The work a started agent was started for was cancelled: its runtime was told to stop and its workspace stays.
 * Raised after the transaction committed, for the owner of the work.
 */
final readonly class SessionStartCancelled extends SessionEvent implements SessionStartEvent
{
    public function __construct(public RecordIdentity $work) {}
}
