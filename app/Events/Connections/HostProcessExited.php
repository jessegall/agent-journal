<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Hosts\Contracts\HostProcessEndEvent;

/**
 * The process's exit is proven, with its code or signal.
 */
final readonly class HostProcessExited implements ConnectionEvent, HostProcessEndEvent
{
    public function __construct(
        public string $processId,
        public string|null $runtimeId,
        public int|null $exitCode,
        public string|null $signal,
        public string $evidence,
    ) {}
}
