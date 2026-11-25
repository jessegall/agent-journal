<?php

declare(strict_types=1);

namespace App\Support\Storage;

use App\Enums\Hooks\AnswerType;
use Spatie\LaravelData\Data;

/**
 * A frame the walk asked, the method it asked and the decision it returned.
 */
final class WalkStep extends Data
{
    public function __construct(
        public readonly string $frameId,
        public readonly string $stateType,
        public readonly string $hookMethod,
        public readonly AnswerType $answer,
        public readonly int $contextCount,
        public readonly string|null $denialReason = null,
    ) {}
}
