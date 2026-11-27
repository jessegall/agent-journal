<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A driver's build probe did not run to its end, so its build is unknown: the start ends with the host's own reason,
 * never as a wrong build.
 */
final class ProbeFailed extends RuntimeException implements CommandRefusal
{
    public static function of(string $driver, string $evidence): self
    {
        return new self("The {$driver} build probe did not answer: it {$evidence}");
    }
}
