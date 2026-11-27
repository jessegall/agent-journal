<?php

declare(strict_types=1);

namespace App\Hosts\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use RuntimeException;

/**
 * A host sent a call whose body does not follow host protocol 1: it is not JSON, holds a field the protocol does not
 * know, or misses one it needs. The host is answered 422 with the field and the call named.
 */
final class HostCallUnreadable extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function notJson(string $call, string $reason): self
    {
        return new self("The host's {$call} is not JSON: {$reason}.");
    }

    public static function unknownField(string $call, string $field): self
    {
        return new self("The host's {$call} holds the field {$field}, which host protocol 1 does not know.");
    }

    public static function missingField(string $call, string $field): self
    {
        return new self("The host's {$call} misses its field {$field}.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }

    protected function status(): int
    {
        return 422;
    }
}
