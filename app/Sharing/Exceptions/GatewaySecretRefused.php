<?php

declare(strict_types=1);

namespace App\Sharing\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use InvalidArgumentException;

/**
 * A secret reference that is no plain name, or one the credential store does not hold.
 */
final class GatewaySecretRefused extends InvalidArgumentException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function forReference(string $reference): self
    {
        $shown = mb_strimwidth($reference, 0, 40, '...');

        return new self(
            "A secret reference is lower-case letters, digits, dashes and underscores; {$shown} is not one.",
        );
    }

    public static function missing(string $reference): self
    {
        return new self("No secret is stored under {$reference}; enter it before configuring the gateway.");
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
