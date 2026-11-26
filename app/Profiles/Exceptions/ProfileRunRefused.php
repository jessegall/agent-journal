<?php

declare(strict_types=1);

namespace App\Profiles\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A step outcome for a run that does not wait on that step; nothing is recorded or resumed.
 */
final class ProfileRunRefused extends RuntimeException implements CommandRefusal
{
    public static function stepNotAwaited(string $runId, string $reference): self
    {
        return new self("Profile run {$runId} does not wait on step {$reference}; nothing was recorded.");
    }
}
