<?php

declare(strict_types=1);

namespace Domain\Plans\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\CoreToolName;
use App\Engine\Enums\RefusalCode;
use RuntimeException;

/**
 * A phase was offered a check result it cannot rely on; the message links the run and the recovery.
 */
final class PhaseCheckRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function noReceipt(string $receiptId): self
    {
        return new self(
            sprintf(
                'Receipt %s is not a current validated result: rerun the check after the phase, or read its run with the %s '
                .'tool and recover by an approved replay.',
                $receiptId,
                CoreToolName::OutputsRead->value,
            ),
        );
    }

    public static function stale(string $receiptId, string $runId): self
    {
        return new self(
            sprintf(
                "Receipt %s of run %s is older than the phase's last task change: rerun the check now the phase is written.",
                $receiptId,
                $runId,
            ),
        );
    }

    protected function status(): int
    {
        return 409;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::StateBlocked;
    }
}
