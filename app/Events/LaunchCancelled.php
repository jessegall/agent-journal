<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Events\Event;
use App\Support\RecordIdentity;

/**
 * The work a started agent was launched for was cancelled: its runtime was told to stop and its workspace stays.
 * Raised after the transaction committed, for the owner of the work.
 */
final readonly class LaunchCancelled implements Event
{
    public function __construct(public RecordIdentity $work) {}
}
