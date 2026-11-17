<?php

declare(strict_types=1);

namespace App\Core\Assignments\Exceptions;

use RuntimeException;

final class AssignmentGroupTooLarge extends RuntimeException
{
    public static function for(int $count): self
    {
        return new self("One command covers at most 1000 records; this one would cover {$count}.");
    }
}
