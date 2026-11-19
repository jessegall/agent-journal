<?php

declare(strict_types=1);

namespace App\Sharing\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A gateway made the default before it is ready to open: there is no automatic default and no silent fallback.
 */
final class GatewayNotReady extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    /**
     * @param  list<string>  $problems
     */
    public static function forDefault(string $gatewayKey, array $problems): self
    {
        return new self("The {$gatewayKey} gateway is not ready to be the default: ".implode(' ', $problems));
    }

    protected function status(): int
    {
        return 422;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Unavailable;
    }
}
