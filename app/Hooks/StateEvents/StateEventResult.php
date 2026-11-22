<?php

declare(strict_types=1);

namespace App\Hooks\StateEvents;

use App\Bus\Contracts\Command;
use App\Contracts\Event;
use App\Hooks\Declarations\StateMethod;
use App\Hooks\Stack\SelectedStateMethod;
use App\Hooks\Storage\FrameRecord;

/**
 * The commands and events a state's listener answered with, and the frame occurrence they came from.
 */
final readonly class StateEventResult
{
    /**
     * @param  list<Command<mixed>|Event>  $effects
     */
    private function __construct(
        public FrameRecord $frame,
        public StateMethod $method,
        public array $effects,
    ) {}

    /**
     * @param  list<Command<mixed>|Event>  $effects
     */
    public static function fromSelection(SelectedStateMethod $selection, array $effects): self
    {
        return new self($selection->frame->record(), $selection->method, $effects);
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
