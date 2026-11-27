<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Attributes\Listeners\InCommandTransaction;
use App\Contracts\Events\Listener;
use App\Hosts\Contracts\HostProcessEndEvent;
use App\Hosts\Protocol\HostRefusal;
use App\Models\Hosts\HostInstruction;
use App\Time\Contracts\ServerClock;

/**
 * A process that exited or was lost runs none of its open instructions: each is refused as not running, but for the stop
 * or removal its host still answers.
 */
#[InCommandTransaction]
final readonly class RefuseInstructionsOfEndedProcess implements Listener
{
    public function __construct(private ServerClock $clock) {}

    public function handle(HostProcessEndEvent $fact): void
    {
        foreach (HostInstruction::findOpenOf($fact->processId) as $instruction) {
            if ($instruction->type->endsProcess()) {
                continue;
            }

            $instruction->refuse(HostRefusal::NotRunning, null, [], $this->clock->now());
        }
    }
}
