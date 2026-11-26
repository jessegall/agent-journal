<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use RuntimeException;

/**
 * A host cannot be upgraded now: it carries out no upgrade, the release is not the one the journal publishes, or a
 * process still runs on it.
 */
final class HostUpgradeRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function forNoUpgrade(string $hostId): self
    {
        return new self("Host {$hostId} carries out no upgrade; it is updated where it runs.");
    }

    public static function forOtherRelease(string $release, string $published): self
    {
        return new self("Release {$release} is not the one the journal publishes now, {$published}.");
    }

    public static function forLiveProcess(string $hostId): self
    {
        return new self("A process still runs on host {$hostId}; it upgrades once every process ended.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }

    protected function status(): int
    {
        return 409;
    }
}
