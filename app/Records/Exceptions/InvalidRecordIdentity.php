<?php

declare(strict_types=1);

namespace App\Records\Exceptions;

use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use InvalidArgumentException;

/**
 * A record named by a type that is no link alias, or by an id that is no ULID.
 */
final class InvalidRecordIdentity extends InvalidArgumentException implements CommandRefusal
{
    use RendersRefusal;

    public static function forType(string $type): self
    {
        return new self("A record type is a link alias such as tasks.task; \"{$type}\" is not one.");
    }

    public static function forId(string $type, string $id): self
    {
        return new self("A {$type} id is a ULID; {$id} is not one.");
    }

    protected function status(): int
    {
        return 422;
    }
}
