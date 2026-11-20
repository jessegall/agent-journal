<?php

declare(strict_types=1);

namespace App\Hooks\Storage;

use App\Hooks\Enums\AnswerType;
use App\Hooks\Enums\SelectionReason;
use App\Hooks\Enums\TransitionType;
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
}
