<?php

declare(strict_types=1);

namespace App\Support\Stack;

use App\Contracts\Actors\AgentTexts;
use App\Contracts\Events\Event;
use App\Declarations\StateMethod;
use App\Enums\AnswerType;
use App\Support\Decisions\Decision;
use App\Support\Stack\Frames\Frame;
use App\Support\Storage\WalkStep;

/**
 * A method selected on one live frame of the starting snapshot.
 */
final readonly class SelectedStateMethod
{
    public function __construct(
        public Frame $frame,
        public StateMethod $method,
    ) {}

    public function answerEvent(Event $event): mixed
    {
        return $this->frame->answerEvent($event, $this->method->name);
    }

    /**
     * The step of a walk this selection took: the frame and method it chose, how the state answered and how many
     * lines it added.
     */
    public function walkStep(Decision $decision, int $lineCount, AgentTexts $texts): WalkStep
    {
        return new WalkStep(
            frameId: $this->frame->id,
            stateType: $this->frame->typeKey(),
            hookMethod: $this->method->name,
            answer: $decision->answerType(),
            contextCount: $lineCount,
            denialReason: $decision->answerType() === AnswerType::Deny
                ? $texts->render($decision->refusalReason())
                : null,
        );
    }
}
