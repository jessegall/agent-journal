<?php

declare(strict_types=1);

namespace Domain\Rules\Support;

use App\Support\NumberedReferenceRecognizer;

/**
 * Recognizes a whole input that is a rule reference, such as rule 34, in any case.
 */
final readonly class RuleReferenceRecognizer extends NumberedReferenceRecognizer
{
    protected function word(): string
    {
        return 'rule';
    }
}
