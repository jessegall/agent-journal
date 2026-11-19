<?php

declare(strict_types=1);

namespace Domain\Documents\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A report number that no readable report has. A number outside the reader's scope answers the same, so it reveals
 * nothing.
 */
final class ReportMissing extends RuntimeException implements CommandRefusal
{
    public static function numbered(int $number): self
    {
        return new self("There is no report {$number} to read.");
    }
}
