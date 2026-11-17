<?php

declare(strict_types=1);

namespace App\Core\Assignments\Exceptions;

use InvalidArgumentException;

final class InvalidAssignmentPage extends InvalidArgumentException
{
    public static function forLimit(int $limit): self
    {
        return new self("A page holds 1 to 100 entries; {$limit} is not allowed.");
    }

    public static function forCursor(int $afterId): self
    {
        return new self("A page starts after a positive id; {$afterId} is not one.");
    }
}
