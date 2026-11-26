<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use RuntimeException;

/**
 * A host that speaks another host protocol than the journal orders in: it is told to update, with Upgrade Required.
 */
final class HostProtocolUnsupported extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function forHost(string $hostId, int $protocol): self
    {
        return new self("Host {$hostId} speaks host protocol {$protocol}; update the host to protocol 1.");
    }

    protected function status(): int
    {
        return 426;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::StateBlocked;
    }
}
