<?php

declare(strict_types=1);

namespace App\Processes\Exceptions;

use LogicException;

/**
 * A receipt was about to be published from an assessment that is not valid, or whose run no longer holds.
 */
final class EvidenceRejected extends LogicException
{
    public static function notValid(string $assessmentId): self
    {
        return new self("Assessment {$assessmentId} is not valid evidence, so it gets no result receipt.");
    }
}
