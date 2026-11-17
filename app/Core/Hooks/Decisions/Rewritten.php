<?php

declare(strict_types=1);

namespace App\Core\Hooks\Decisions;

use App\Core\Hooks\Contracts\Answer;

/**
 * The shell line to run instead of the one the agent wrote; the Processes parser reads it again.
 */
final readonly class Rewritten implements Answer
{
    public function __construct(public string $line) {}

    public function kind(): AnswerKind
    {
        return AnswerKind::Rewrite;
    }
}
