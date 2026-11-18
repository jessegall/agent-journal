<?php

declare(strict_types=1);

namespace Domain\Tasks\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Contracts\CommandRefusal;
use InvalidArgumentException;

/**
 * A task text longer than Tasks allows.
 */
final class TaskTextTooLong extends InvalidArgumentException implements CodedRefusal, CommandRefusal
{
    public static function for(string $field, int $limit): self
    {
        return new self("A task's {$field} is at most {$limit} characters.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }
}
