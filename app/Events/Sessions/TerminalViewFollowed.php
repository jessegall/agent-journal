<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Drivers\TerminalViewEvent;

/**
 * A terminal view follows a runtime at its process generation.
 */
final readonly class TerminalViewFollowed implements SessionEvent, TerminalViewEvent
{
    public function __construct(
        public string $viewId,
        public string $runtimeId,
    ) {}
}
