<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use App\Enums\NavigationState;
use RuntimeException;

/**
 * A navigation request asked to move where its state table does not let it.
 */
final class NavigationTransitionRefused extends RuntimeException implements CommandRefusal
{
    public static function from(NavigationState $state, NavigationState $next): self
    {
        return new self("A navigation request that is {$state->value} cannot become {$next->value}.");
    }
}
