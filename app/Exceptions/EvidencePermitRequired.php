<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Api\Exceptions\CommandStopped;

/**
 * process:run was asked to start no admission: a run starts only from an admission or an evidence permit.
 */
final class EvidencePermitRequired extends CommandStopped
{
    public static function forRun(): self
    {
        return new self('An evidence permit is required: a project owner issues one for the exact command line.');
    }
}
