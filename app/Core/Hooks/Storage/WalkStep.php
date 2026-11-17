<?php

declare(strict_types=1);

namespace App\Core\Hooks\Storage;

use App\Core\Hooks\Decisions\AnswerKind;
use App\Core\Hooks\Decisions\TransitionKind;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;

/**
 * One state the walk asked: which frame, which hook, what it answered and which transition it made. The transition is
 * stored and shown under its first name, change, so recorded walks read as before.
 */
final class WalkStep extends Data
{
    public function __construct(
        public readonly string $frameId,
        public readonly string $stateType,
        public readonly string $hookMethod,
        public readonly AnswerKind $answer,
        #[MapName('change')]
        public readonly TransitionKind $transition,
    ) {}
}
