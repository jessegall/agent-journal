<?php

declare(strict_types=1);

namespace App\Sharing\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use App\Sharing\Enums\ShareState;
use RuntimeException;

/**
 * A share whose members may not be replaced: it is not live, or the preview shows another record than its root.
 */
final class ShareRefreshRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function notLive(string $shareId, ShareState $state): self
    {
        return new self("Share {$shareId} is {$state->value} and past changing; share the record again instead.");
    }

    public static function otherRoot(string $shareId): self
    {
        return new self("The preview shows another record than share {$shareId}; preview its own record.");
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
