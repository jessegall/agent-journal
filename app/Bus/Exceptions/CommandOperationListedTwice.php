<?php

declare(strict_types=1);

namespace App\Bus\Exceptions;

use RuntimeException;

/**
 * Two commands of one owner would go by the same operation name, such as an area pair and its moved copy in
 * App\Commands, so a receipt or a log could not tell them apart.
 */
final class CommandOperationListedTwice extends RuntimeException
{
    public static function for(string $owner, string $operation, string $first, string $second): self
    {
        return new self("{$owner} lists two commands named {$operation}: {$first} and {$second}; keep one pair.");
    }
}
