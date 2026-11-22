<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use InvalidArgumentException;

/**
 * A record named by a type that is no link alias, or by an id that is no ULID.
 */
final class InvalidRecordIdentity extends InvalidArgumentException implements CodedRefusal, CommandRefusal
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

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }
}
