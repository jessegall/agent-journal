<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A host report the journal will not apply: about a runtime of another host, or older than the facts it already holds.
 */
final class HostReportRefused extends RuntimeException implements CommandRefusal
{
    public static function notOwned(string $runtimeId): self
    {
        return new self("The runtime {$runtimeId} does not run on this host.");
    }

    public static function staleGeneration(string $runtimeId, int $reported, int $current): self
    {
        return new self(
            "A report of process generation {$reported} is older than generation {$current} of runtime {$runtimeId}.",
        );
    }

    public static function staleAttempt(string $requestId, int $reported, int $current): self
    {
        return new self("A report of attempt {$reported} is older than attempt {$current} of request {$requestId}.");
    }
}
