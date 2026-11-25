<?php

declare(strict_types=1);

namespace App\Support\StateEvents;

use App\Contracts\Bus\Command;
use App\Contracts\Events\Event;
use App\Enums\Engine\CommandOriginStatus;
use App\Values\StackTarget;
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

    /**
     * The frame whose state answered the fact.
     */
    public function frameId(): string
    {
        return $this->listenerResult->frameId();
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
