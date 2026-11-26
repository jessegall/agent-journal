<?php

declare(strict_types=1);

namespace App\Assignments\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use RuntimeException;

final class AssignmentGroupTooLarge extends RuntimeException implements CommandRefusal
{
    public static function for(int $count): self
    {
        return new self("This work unit exceeds the 1,000-record limit: it would cover {$count} records.");
    }
}
