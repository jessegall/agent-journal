<?php

declare(strict_types=1);

namespace Domain\Sharing\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use RuntimeException;

/**
 * A gateway made the default before it is ready to open: there is no automatic default and no silent fallback.
 */
final class GatewayNotSetUp extends RuntimeException implements CodedRefusal, CommandRefusal
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
