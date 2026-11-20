<?php

declare(strict_types=1);

namespace App\Hooks\StateEvents;

use App\Agents\Support\StackTarget;
use App\Bus\Contracts\Command;
use App\Bus\Enums\CommandOriginStatus;
use Psr\Log\LoggerInterface;

/**
 * The captured dispatch, target and source of a returned command.
 */
final readonly class StateEventOrigin
{
    public function __construct(
        public StateEventDispatch $dispatch,
        public StackTarget $target,
        public StateEventResult $listenerResult,
    ) {}

    /**
     * @return list<Command<mixed>>
     */
    public function commands(): array
    {
        return $this->result->commandList();
    }

    public function logDrop(LoggerInterface $log, CommandOriginStatus $status): void
    {
        $log->info('State event commands dropped after rechecking the origin.', [
            'dispatch' => $this->dispatch->id,
            'event' => $this->dispatch->event::class,
            'target' => $this->target->description(),
            'frame' => $this->result->frameId(),
            'status' => $status->value,
        ]);
    }
}
