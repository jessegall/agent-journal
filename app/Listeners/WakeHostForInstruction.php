<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Events\Listener;
use App\Events\Connections\HostInstructionMade;
use App\Hosts\HostWake;

/**
 * Wakes the host's long poll once a new instruction for it is committed, so the host claims it at once.
 */
final readonly class WakeHostForInstruction implements Listener
{
    public function __construct(private HostWake $wake) {}

    public function handle(HostInstructionMade $fact): void
    {
        $this->wake->wakeHost($fact->hostId);
    }
}
