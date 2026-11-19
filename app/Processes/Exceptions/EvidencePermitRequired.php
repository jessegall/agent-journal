<?php

declare(strict_types=1);

namespace App\Processes\Exceptions;

use RuntimeException;

/**
 * process:run was asked to start no admission: a run starts only from an admission or an evidence permit.
 */
final class EvidencePermitRequired extends RuntimeException
{
    public static function forRun(): self
    {
        return new self('An evidence permit is required: a project owner issues one for the exact command line.');
    }
}
