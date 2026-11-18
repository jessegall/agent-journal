<?php

declare(strict_types=1);

namespace App\Sharing\Exceptions;

use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * No open proposal of this id: never made, already approved or dismissed, or expired.
 */
final class ShareProposalUnavailable extends RuntimeException implements CommandRefusal
{
    use RendersRefusal;

    public static function for(string $shareId): self
    {
        return new self("Share {$shareId} is no open proposal; it was approved, dismissed or has expired.");
    }

    public static function forOtherRoot(string $shareId): self
    {
        return new self("The preview shows another record than proposal {$shareId}; preview the proposed record.");
    }

    protected function status(): int
    {
        return 409;
    }
}
