<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use RuntimeException;

final class StartPreviewStale extends RuntimeException implements CommandRefusal
{
    public static function since(int $previewed, int $current): self
    {
        return new self(
            "The drivers changed since this start was previewed (revision {$previewed}, now {$current}); "
            .'check the preview again.',
        );
    }
}
