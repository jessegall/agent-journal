<?php

declare(strict_types=1);

namespace Domain\Documents\Support;

use App\Support\NumberedReferenceRecognizer;

/**
 * Recognizes a whole input that is a doc reference, such as doc 104, in any case.
 */
final readonly class DocumentReferenceRecognizer extends NumberedReferenceRecognizer
{
    protected function word(): string
    {
        return 'doc';
    }
}
