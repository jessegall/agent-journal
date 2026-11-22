<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use InvalidArgumentException;

/**
 * A container manifest that asks for more than a helper may have; nothing is started.
 */
final class ManifestRefused extends InvalidArgumentException implements CommandRefusal
{
    public static function because(string $reason): self
    {
        return new self("The helper container was refused: {$reason}.");
    }
}
