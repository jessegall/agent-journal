<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Runs\ClaimedOutcome;
use App\Enums\Runs\ProblemCode;

/**
 * A reader's judgement of a finished part's output: its records, every problem found
 * at once, the counts and progress the output states, and the outcome it claims. It is evidence for a result, never a
 * result receipt.
 */
final readonly class ReaderAssessment
{
    /**
     * @param  list<OutputRecord>  $records
     * @param  list<OutputProblem>  $problems
     * @param  array<string, int>  $counts
     */
    public function __construct(
        public array $records,
        public array $problems,
        public array $counts,
        public ReadProgress $progress,
        public ClaimedOutcome $claimed,
    ) {}

    public function isClean(): bool
    {
        return $this->problems === [];
    }

    public function has(ProblemCode $code): bool
    {
        foreach ($this->problems as $problem) {
            if ($problem->code === $code) {
                return true;
            }
        }

        return false;
    }
}
