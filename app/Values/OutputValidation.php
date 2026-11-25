<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Runs\AssessmentOutcome;

/**
 * What the validator found in one part's output: every problem with its code, and the outcome, which is unavailable
 * whenever a problem was found.
 */
final readonly class OutputValidation
{
    /**
     * @param  list<OutputProblem>  $problems
     */
    public function __construct(public array $problems, public AssessmentOutcome $outcome) {}

    public function isValid(): bool
    {
        return $this->problems === [];
    }
}
