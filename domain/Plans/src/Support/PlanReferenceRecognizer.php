<?php

declare(strict_types=1);

namespace Domain\Plans\Support;

use App\Support\NumberedReferenceRecognizer;

/**
 * Recognizes a whole input that is a plan reference, plan 57, in any case.
 */
final readonly class PlanReferenceRecognizer extends NumberedReferenceRecognizer
{
    protected function word(): string
    {
        return 'plan';
    }
}
