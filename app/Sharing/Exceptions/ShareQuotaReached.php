<?php

declare(strict_types=1);

namespace App\Sharing\Exceptions;

use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * The installation already holds as many live, unexpired shares as it may.
 */
final class ShareQuotaReached extends RuntimeException implements CommandRefusal
{
    use RendersRefusal;

    public static function at(int $most): self
    {
        return new self("The journal already holds {$most} live shares; revoke one or let one expire before sharing another.");
    }

    protected function status(): int
    {
        return 409;
    }
}
