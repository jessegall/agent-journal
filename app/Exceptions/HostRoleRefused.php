<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use RuntimeException;

/**
 * A host called a route that is not for its role: an enrolled host on a folder relay's route, a relay on an enrolled
 * host's route, or a relay whose binding is no longer live.
 */
final class HostRoleRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function forEnrolledOnly(string $hostId): self
    {
        return new self("Host {$hostId} is the relay of a connected folder; this route is for enrolled hosts only.");
    }

    public static function forRelayOnly(string $hostId): self
    {
        return new self("Host {$hostId} is not the relay of a connected folder; this route is for relays only.");
    }

    public static function forNoLiveBinding(string $hostId): self
    {
        return new self("Host {$hostId} relays no live binding; connect the folder again.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Forbidden;
    }

    protected function status(): int
    {
        return 403;
    }
}
