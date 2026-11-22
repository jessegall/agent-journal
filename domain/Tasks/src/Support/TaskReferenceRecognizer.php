<?php

declare(strict_types=1);

namespace Domain\Tasks\Support;

use App\Support\NumberedReferenceRecognizer;

/**
 * Recognizes a whole input that is a task reference, task 2241, in any case.
 */
final readonly class TaskReferenceRecognizer extends NumberedReferenceRecognizer
{
    protected function word(): string
    {
        return 'task';
    }
}
