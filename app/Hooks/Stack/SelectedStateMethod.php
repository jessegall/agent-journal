<?php

declare(strict_types=1);

namespace App\Hooks\Stack;

use App\Contracts\Event;
use App\Hooks\Declarations\StateMethod;
use App\Hooks\Enums\SelectionReason;
use App\Hooks\Values\EventCommands;

/**
 * A method selected on one live frame of the starting snapshot.
 */
final readonly class SelectedStateMethod
{
    public function __construct(
        public Frame $frame,
        public StateMethod $method,
        public SelectionReason $reason,
    ) {}

    public function answerEvent(Event $event): EventCommands
    {
        return $this->frame->answerEvent($event, $this->method->name);
    }
}
