<?php

declare(strict_types=1);

namespace Domain\Sharing\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use Domain\Sharing\Enums\ShareState;
use RuntimeException;

/**
 * Only a pending or failed share whose deadline has not passed may try its gateway again.
 */
final class ShareRetryRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function for(string $shareId, ShareState $state): self
    {
        return new self(
            "Share {$shareId} is {$state->value}; only a pending or failed share before its deadline opens again.",
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
