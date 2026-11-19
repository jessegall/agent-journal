<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Agents\Enums\StartRefusalType;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A required container start whose image is not the verified helper image.
 */
final class ImageUnverified extends RuntimeException implements CommandRefusal
{
    public static function because(string $reason): self
    {
        return new self("The helper image {$reason} is not the verified one. Nothing was started.");
    }

    public function reason(): StartRefusalType
    {
        return StartRefusalType::ImageUnverified;
    }
}
