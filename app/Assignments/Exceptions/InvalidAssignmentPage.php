<?php

declare(strict_types=1);

namespace App\Assignments\Exceptions;

use App\Contracts\CommandRefusal;
use InvalidArgumentException;

final class InvalidAssignmentPage extends InvalidArgumentException implements CommandRefusal
{
    public static function forLimit(int $limit): self
    {
        return new self("A page holds 1 to 100 entries; {$limit} is not allowed.");
    }

    public static function forCursor(string $afterId): self
    {
        return new self("A page starts after a ULID; {$afterId} is not one.");
    }

    public static function forRecordCount(int $count): self
    {
        return new self("One read covers at most 100 records; this one asks for {$count}.");
    }

    public static function forPageNumber(int $number): self
    {
        return new self("Pages are numbered from 1; {$number} is not a page.");
    }
}
