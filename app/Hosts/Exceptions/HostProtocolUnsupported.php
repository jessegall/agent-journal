<?php

declare(strict_types=1);

namespace App\Hosts\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use RuntimeException;

/**
 * A host that speaks another host protocol than the journal instructs in: it is told to update, with Upgrade Required.
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
