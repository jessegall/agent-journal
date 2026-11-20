<?php

declare(strict_types=1);

namespace App\Hooks\Storage;

use App\Hooks\Decisions\Decision;
use App\Hooks\Enums\AnswerType;
use App\Hooks\Enums\SelectionReason;
use App\Hooks\Enums\TransitionType;
use App\Hooks\Stack\SelectedStateMethod;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;

/**
 * The selected frame, its reason for selection, and the decision it returned.
 * The stored key for a transition is change.
 */
final class WalkStep extends Data
{
    public function __construct(
        public readonly string $frameId,
        public readonly string $stateType,
        public readonly string $hookMethod,
        public readonly AnswerType $answer,
        #[MapName('change')]
        public readonly TransitionType $transition,
        public readonly int $contextCount,
        public readonly SelectionReason|null $selectionReason = null,
        public readonly string|null $denialReason = null,
    ) {}

    public static function fromDecision(SelectedStateMethod $selected, Decision $decision): self
    {
        return new self(
            frameId: $selected->frame->id,
            stateType: $selected->frame->typeKey(),
            hookMethod: $selected->method->name,
            answer: $decision->answerType(),
            transition: $decision->transition->type(),
            contextCount: count($decision->context),
            selectionReason: $selected->reason,
            denialReason: $decision->answerType() === AnswerType::Deny ? $decision->refusalReason() : null,
        );
    }
}
