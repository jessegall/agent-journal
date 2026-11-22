<?php

declare(strict_types=1);

namespace App\Hooks\StateEvents;

use App\Agents\Values\StackTarget;
use App\Bus\Contracts\Command;
use App\Bus\Enums\CommandOriginStatus;
use App\Contracts\Event;
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
     * @return list<Command<mixed>|Event>
     */
    public function effects(): array
    {
        return $this->listenerResult->effects;
    }

    public function logDrop(LoggerInterface $log, CommandOriginStatus $status): void
    {
        $log->info('State event commands dropped after rechecking the origin.', [
            'dispatch' => $this->dispatch->id,
            'event' => $this->dispatch->event::class,
            'target' => $this->target->description(),
            'frame' => $this->listenerResult->frameId(),
            'status' => $status->value,
        ]);
    }
}
