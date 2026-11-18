<?php

declare(strict_types=1);

namespace Domain\Plans\Exceptions;

use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A phase was offered a check result it cannot rely on; the message links the run and the recovery.
 */
final class PhaseCheckRefused extends RuntimeException implements CommandRefusal
{
    use RendersRefusal;

    public static function noReceipt(string $receiptId): self
    {
        return new self("Receipt {$receiptId} is not a current validated result: rerun the check after the phase, or"
            .' read its run with journal output read and recover by an approved replay.');
    }

    public static function stale(string $receiptId, string $runId): self
    {
        return new self("Receipt {$receiptId} of run {$runId} is older than the phase's last task change: rerun the"
            .' check now the phase is written.');
    }

    protected function status(): int
    {
        return 409;
    }
}
