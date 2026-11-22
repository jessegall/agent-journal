<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Support\RecordIdentity;
use RuntimeException;

/**
 * An import asked for work no passed stop certified under that certificate; nothing is imported.
 */
final class HelperWorkUncertified extends RuntimeException
{
    public static function for(RecordIdentity $work, string $certificate): self
    {
        return new self(
            "The work {$work->type}:{$work->id} has no certified completion {$certificate}; nothing was imported.",
        );
    }
}
