<?php

declare(strict_types=1);

namespace App\Support\Decisions;

use App\Contracts\Chat\Answer;
use App\Enums\AnswerType;

/**
 * The shell line to run instead of the one the agent wrote; the Processes parser reads it again.
 */
final readonly class Rewritten implements Answer
{
    public function __construct(public string $line) {}

    public function type(): AnswerType
    {
        return AnswerType::Rewrite;
    }
}
