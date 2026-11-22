<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Support\NumberedReferenceRecognizer;

/**
 * Recognizes a whole input that is a report reference, such as report 104, in any case.
 */
final readonly class ReportReferenceRecognizer extends NumberedReferenceRecognizer
{
    protected function word(): string
    {
        return 'report';
    }
}
