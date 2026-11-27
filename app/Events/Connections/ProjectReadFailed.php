<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Connections\Contracts\ProjectReadEvent;
use App\Hosts\Protocol\HostProjectReadFailure;

/**
 * A project read failed.
 */
final readonly class ProjectReadFailed implements ConnectionEvent, ProjectReadEvent
{
    public function __construct(
        public string $readId,
        public HostProjectReadFailure $failure,
    ) {}
}
