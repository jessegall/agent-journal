<?php

declare(strict_types=1);

namespace App\Support\StateEvents;

use App\Contracts\Bus\Command;
use App\Contracts\Events\Event;
use App\Declarations\StateMethod;
use App\Enums\StackMoment;
use App\Support\References\StateReference;
use App\Support\Stack\FrameMoment;
use App\Support\Stack\SelectedStateMethod;
use App\Support\Storage\FrameRecord;

/**
 * The commands and events a state's listener answered with, and the frame occurrence they came from.
 */
final readonly class StateEventResult
{
    /**
     * @param  list<Command<mixed>|Event>  $effects
     * @param  list<StateReference>  $pushes  the states the method asked to push onto its stack
     */
    private function __construct(
        public FrameRecord $frame,
        public StateMethod $method,
        public array $effects,
        public array $pushes = [],
    ) {}

    /**
     * @param  list<Command<mixed>|Event|StateReference>  $answered
     */
    public static function fromSelection(SelectedStateMethod $selection, array $answered): self
    {
        $effects = [];
        $pushes = [];

        foreach ($answered as $part) {
            if ($part instanceof StateReference) {
                $pushes[] = $part;

                continue;
            }

            $effects[] = $part;
        }

        return new self($selection->frame->record(), $selection->method, $effects, $pushes);
    }

    /**
     * The commands a state answered a moment of its frame's life with, which run as the frame's own answer.
     */
    public static function fromMoment(FrameMoment $moment): self
    {
        return new self(
            $moment->frame->record(),
            $moment->frame->momentMethod($moment->moment),
            $moment->effects(),
        );
    }

    /**
     * Whether the commands answer a moment of the frame's life rather than the fact itself.
     */
    public function answersAMoment(): bool
    {
        return StackMoment::tryFrom($this->method->name) instanceof StackMoment;
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
