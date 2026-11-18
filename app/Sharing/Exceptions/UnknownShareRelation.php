<?php

declare(strict_types=1);

namespace App\Sharing\Exceptions;

use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A share read names a relation the record type does not declare.
 */
final class UnknownShareRelation extends RuntimeException implements CommandRefusal
{
    use RendersRefusal;

    public static function for(string $alias, string $relation): self
    {
        return new self("{$alias} declares no share relation named {$relation}.");
    }

    protected function status(): int
    {
        return 404;
    }
}
