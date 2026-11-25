<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Drivers\TerminalViewEvent;

/**
 * A terminal view was closed.
 */
final readonly class TerminalViewClosed implements SessionEvent, TerminalViewEvent
{
    public function __construct(
        public string $viewId,
    ) {}
}
