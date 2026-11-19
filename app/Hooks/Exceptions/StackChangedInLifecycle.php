<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use LogicException;

/**
 * A lifecycle method that tried to change the stack it runs for; it sets things up, it does not move frames.
 */
final class StackChangedInLifecycle extends LogicException
{
    public static function for(string $target): self
    {
        return new self(
            "A lifecycle method tried to change the stack of {$target} while it ran: lifecycle methods set up and "
                .'clean up, they never push or remove frames.',
        );
    }
}
