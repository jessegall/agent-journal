<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Support\References\Exceptions\WorkOccurrenceStale;
use App\Support\References\WorkOccurrence;

/**
 * What the owner of a ticking state type answers for the work behind its frames: whether one occurrence is still live,
 * checked under the subject's row lock so a finish cannot slip in before the command that relies on it commits.
 */
interface WorkOccurrenceGuard
{
    /**
     * Takes the subject's row lock, held to the end of the transaction, and refuses an occurrence that is over.
     *
     * @throws WorkOccurrenceStale
     */
    public function lockAndRequireLive(WorkOccurrence $occurrence): void;
}
