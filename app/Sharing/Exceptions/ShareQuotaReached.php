<?php

declare(strict_types=1);

namespace App\Sharing\Exceptions;

use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * The installation already holds as many live, unexpired shares, or as many unexpired proposals, as it may.
 */
final class ShareQuotaReached extends RuntimeException implements CommandRefusal
{
    use RendersRefusal;

    public static function at(int $most): self
    {
        return new self("The journal already holds {$most} live shares; revoke one or let one expire before sharing another.");
    }

    public static function forProposals(int $most): self
    {
        return new self("The journal already holds {$most} open share proposals; ask the owner to approve or dismiss some first.");
    }

    protected function status(): int
    {
        return 409;
    }
}
