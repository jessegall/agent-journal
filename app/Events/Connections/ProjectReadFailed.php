<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Contracts\Connections\ProjectReadEvent;
use App\Enums\ProjectReadFailure;

/**
 * A project read failed.
 */
final readonly class ProjectReadFailed extends ConnectionEvent implements ProjectReadEvent
{
    public function __construct(
        public string $readId,
        public ProjectReadFailure $failure,
    ) {}
}
