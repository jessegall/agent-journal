<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Drivers\TerminalViewEvent;

/**
 * A terminal view follows a runtime at its process generation.
 */
final readonly class TerminalViewFollowed extends SessionEvent implements TerminalViewEvent
{
    public function __construct(
        public string $viewId,
        public string $runtimeId,
    ) {}
}
