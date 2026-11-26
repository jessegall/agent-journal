<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use RuntimeException;

/**
 * A host asked for a second long poll while its first still waits.
 */
final class HostClaimBusy extends RuntimeException implements CodedRefusal
{
    use RendersRefusal;

    public static function forHost(string $hostId): self
    {
        return new self("Host {$hostId} already waits in a claim; one claim per host at a time.");
    }

    protected function status(): int
    {
        return 429;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }
}
