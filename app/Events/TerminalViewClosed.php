<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Drivers\TerminalViewEvent;

/**
 * A terminal view was closed.
 */
final readonly class TerminalViewClosed extends SessionEvent implements TerminalViewEvent
{
    public function __construct(
        public string $viewId,
    ) {}
}
