<?php

declare(strict_types=1);

namespace App\Sharing\Exceptions;

use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A share names a record type no domain registered for sharing.
 */
final class UnknownShareRecordType extends RuntimeException implements CommandRefusal
{
    use RendersRefusal;

    public static function forAlias(string $alias): self
    {
        return new self("No shareable record type is registered under {$alias}.");
    }

    protected function status(): int
    {
        return 404;
    }
}
