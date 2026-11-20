<?php

declare(strict_types=1);

namespace App\Hooks\StateEvents;

use App\Bus\Contracts\Command;
use App\Hooks\Declarations\StateMethod;
use App\Hooks\Stack\SelectedStateMethod;
use App\Hooks\Storage\FrameRecord;
use App\Hooks\Values\EventCommands;

/**
 * A state listener's result and its originating frame occurrence.
 */
final readonly class StateEventResult
{
    private function __construct(
        public FrameRecord $frame,
        public StateMethod $method,
        public EventCommands $commands,
    ) {}

    public static function fromSelection(SelectedStateMethod $selection, EventCommands $commands): self
    {
        return new self($selection->frame->record(), $selection->method, $commands);
    }

    /**
     * @return list<Command<mixed>>
     */
    public function commandList(): array
    {
        return $this->commands->all();
    }

    public function frameId(): string
    {
        return $this->frame->id;
    }

    public function matches(SelectedStateMethod $selection): bool
    {
        return $this->method == $selection->method && $this->frame->isSameOccurrenceAs($selection->frame->record());
    }
}
