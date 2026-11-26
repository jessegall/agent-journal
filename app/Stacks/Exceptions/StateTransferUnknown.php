<?php

declare(strict_types=1);

namespace App\Stacks\Exceptions;

use RuntimeException;

/**
 * A frame of the stack a resumed session continues names a state type nothing registers any more, so nobody can say
 * whether it carries over; the start is refused rather than drop owed work silently.
 */
final class StateTransferUnknown extends RuntimeException
{
    public static function for(string $frame): self
    {
        return new self("The stack cannot be continued: nothing registers the state of {$frame}.");
    }
}
