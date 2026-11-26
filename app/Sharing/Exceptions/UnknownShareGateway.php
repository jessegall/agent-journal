<?php

declare(strict_types=1);

namespace App\Sharing\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use RuntimeException;

/**
 * A gateway setting names a key no share gateway is registered under.
 */
final class UnknownShareGateway extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function forKey(string $key): self
    {
        return new self("No share gateway is registered under {$key}.");
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
