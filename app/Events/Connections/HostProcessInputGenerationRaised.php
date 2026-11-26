<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Contracts\Hosts\HostProcessEvent;

/**
 * The process's input moved to its next generation, so earlier keys are refused.
 */
final readonly class HostProcessInputGenerationRaised implements ConnectionEvent, HostProcessEvent
{
    public function __construct(public string $processId, public int $generation) {}
}
