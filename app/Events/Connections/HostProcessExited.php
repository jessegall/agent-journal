<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Contracts\Hosts\HostProcessEvent;

/**
 * The process's exit is proven, with its code or signal.
 */
final readonly class HostProcessExited implements ConnectionEvent, HostProcessEvent
{
    public function __construct(
        public string $processId,
        public string|null $runtimeId,
        public int|null $exitCode,
        public string|null $signal,
        public string $evidence,
    ) {}
}
