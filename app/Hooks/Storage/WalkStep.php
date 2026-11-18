<?php

declare(strict_types=1);

namespace App\Hooks\Storage;

use App\Hooks\Enums\AnswerType;
use App\Hooks\Enums\TransitionType;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;

/**
 * One state the walk asked: which frame, which hook, what it answered, which transition it made and how many context
 * entries it added. The transition is stored and shown under its first name, change, so recorded walks read as before;
 * a delegate that added context shows as a delegate with a context count above zero.
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
    ) {}
}
