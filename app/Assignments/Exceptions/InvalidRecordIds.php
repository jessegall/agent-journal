<?php

declare(strict_types=1);

namespace App\Assignments\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use InvalidArgumentException;

/**
 * A list of record ids that repeats an id, holds something other than a ULID or runs past its limit. The message
 * names no id, so nothing a caller sent is echoed back.
 */
final class InvalidRecordIds extends InvalidArgumentException implements CommandRefusal
{
    public static function repeated(): self
    {
        return new self('A list of record ids names each record once; this one repeats an id.');
    }

    public static function notUlids(): self
    {
        return new self('A list of record ids holds only ULIDs; this one holds something else.');
    }

    public static function tooMany(int $count, int $largest): self
    {
        return new self("A list of record ids holds at most {$largest} ids; this one holds {$count}.");
    }
}
