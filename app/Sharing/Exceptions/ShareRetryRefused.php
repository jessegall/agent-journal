<?php

declare(strict_types=1);

namespace App\Sharing\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use App\Sharing\Enums\ShareStatus;
use RuntimeException;

/**
 * Only a pending or failed share whose deadline has not passed may try its gateway again.
 */
final class ShareRetryRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function for(string $shareId, ShareStatus $status): self
    {
        return new self(
            "Share {$shareId} is {$status->value}; only a pending or failed share before its deadline opens again.",
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
