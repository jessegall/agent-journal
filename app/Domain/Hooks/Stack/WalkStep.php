<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Stack;

use App\Domain\Hooks\Decisions\AnswerKind;
use App\Domain\Hooks\Decisions\ChangeKind;
use Spatie\LaravelData\Data;

/**
 * One state the walk asked: which frame, which hook, what it answered and what it changed.
 */
final class WalkStep extends Data
{
    public function __construct(
        public readonly string $frameId,
        public readonly string $stateType,
        public readonly string $hookMethod,
        public readonly AnswerKind $answer,
        public readonly ChangeKind $change,
    ) {}
}
