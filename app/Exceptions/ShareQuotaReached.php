<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\CodedRefusal;
use App\Contracts\CommandRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * The installation already holds as many live, unexpired shares, or as many unexpired proposals, as it may.
 */
final class ShareQuotaReached extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function at(int $most): self
    {
        return new self(
            "The journal already holds {$most} live shares; revoke one or let one expire before sharing another.",
        );
    }

    public static function forProposals(int $most): self
    {
        return new self(
            "The journal already holds {$most} open share proposals; ask the owner to approve or dismiss some first.",
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
