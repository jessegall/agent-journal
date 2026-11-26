<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use App\Enums\Navigation\NavigationStatus;
use RuntimeException;

/**
 * A navigation request asked to move where its state table does not let it.
 */
final class NavigationTransitionRefused extends RuntimeException implements CommandRefusal
{
    public static function from(NavigationStatus $status, NavigationStatus $next): self
    {
        return new self("A navigation request that is {$status->value} cannot become {$next->value}.");
    }
}
