<?php

declare(strict_types=1);

namespace App\Hooks\Stack;

use App\Contracts\Event;
use App\Hooks\Decisions\Decision;
use App\Hooks\Declarations\StateMethod;
use App\Hooks\Enums\AnswerType;
use App\Hooks\Enums\SelectionReason;
use App\Hooks\Stack\Frames\Frame;
use App\Hooks\Storage\WalkStep;
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

    /**
     * The step of a walk this selection took: the frame and method it chose, why, and the decision it got.
     */
    public function walkStep(Decision $decision): WalkStep
    {
        return new WalkStep(
            frameId: $this->frame->id,
            stateType: $this->frame->typeKey(),
            hookMethod: $this->method->name,
            answer: $decision->answerType(),
            transition: $decision->transition->type(),
            contextCount: count($decision->context),
            selectionReason: $this->reason,
            denialReason: $decision->answerType() === AnswerType::Deny ? $decision->refusalReason() : null,
        );
    }
}
