<?php

declare(strict_types=1);

namespace App\Hooks\Stack;

use App\Contracts\Event;
use App\Hooks\Decisions\Decision;
use App\Hooks\Declarations\StateMethod;
use App\Hooks\Enums\AnswerType;
use App\Hooks\Stack\Frames\Frame;
use App\Hooks\Storage\WalkStep;

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
    public function walkStep(Decision|null $decision, int $lineCount): WalkStep
    {
        $denied = $decision !== null && $decision->answerType() === AnswerType::Deny;

        return new WalkStep(
            frameId: $this->frame->id,
            stateType: $this->frame->typeKey(),
            hookMethod: $this->method->name,
            answer: $decision === null ? AnswerType::Delegate : $decision->answerType(),
            contextCount: $lineCount,
            denialReason: $denied ? $decision->refusalReason() : null,
        );
    }
}
