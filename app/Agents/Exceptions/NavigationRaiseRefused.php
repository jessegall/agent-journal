<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A navigation request the host asked for that cannot be raised.
 */
final class NavigationRaiseRefused extends RuntimeException implements CommandRefusal
{
    public static function notAKeyScript(string $requestId): self
    {
        return new self("Request {$requestId} runs no key script, so it has no goal to navigate to.");
    }
}
