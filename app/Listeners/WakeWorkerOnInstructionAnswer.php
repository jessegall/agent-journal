<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Events\Listener;
use App\Hosts\Contracts\HostInstructionAnswerEvent;
use App\Hosts\ProcessFeed;

/**
 * Once a host's answer to an instruction is committed, the worker of its process receives it on the process's feed.
 */
final readonly class WakeWorkerOnInstructionAnswer implements Listener
{
    public function __construct(private ProcessFeed $feed) {}

    public function handle(HostInstructionAnswerEvent $fact): void
    {
        if ($fact->processId === null) {
            return;
        }

        $this->feed->markInstruction($fact->processId, $fact->instructionId);
    }
}
