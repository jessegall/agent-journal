<?php

declare(strict_types=1);

namespace App\Sharing\Exceptions;

use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * No share of this id.
 */
final class ShareUnavailable extends RuntimeException implements CommandRefusal
{
    use RendersRefusal;

    public static function for(string $shareId): self
    {
        return new self("There is no share {$shareId}.");
    }

    protected function status(): int
    {
        return 404;
    }
}
