<?php

declare(strict_types=1);

namespace App\Recordings\Exceptions;

use RuntimeException;

/**
 * A driver's exchange was recorded outside the agent image and every driver image a host built, where it would carry
 * the machine it ran on.
 */
final class RecordingOutsideContainer extends RuntimeException
{
    public static function of(string $exchange, string|null $image): self
    {
        $ranIn = $image === null ? 'on the host itself' : "in the image {$image}";

        return new self("The driver exchange {$exchange} ran {$ranIn}, not in the agent image or a driver image a host built.");
    }
}
