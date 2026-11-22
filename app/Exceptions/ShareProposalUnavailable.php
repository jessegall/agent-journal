<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * No open proposal of this id: never made, already approved or dismissed, or expired.
 */
final class ShareProposalUnavailable extends RuntimeException implements CodedRefusal, CommandRefusal
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

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::StateBlocked;
    }
}
