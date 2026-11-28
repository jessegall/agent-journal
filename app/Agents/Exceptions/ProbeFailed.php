<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Models\Hosts\HostProcess;
use RuntimeException;

/**
 * A driver's probe did not run to its end, so what it was to prove is unknown: the start ends with the host's own
 * reason, never as a wrong build or an account that is not signed in.
 */
final class ProbeFailed extends RuntimeException implements CommandRefusal
{
    public static function of(HostProcess $probe, string $driver): self
    {
        return new self("The {$driver} {$probe->purpose->label()} did not answer: it {$probe->end_evidence}");
    }
}
