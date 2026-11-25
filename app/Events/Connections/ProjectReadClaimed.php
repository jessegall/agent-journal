<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Contracts\Connections\ProjectReadEvent;

/**
 * A host claimed a project read to answer it.
 */
final readonly class ProjectReadClaimed implements ConnectionEvent, ProjectReadEvent
{
    public function __construct(
        public string $readId,
    ) {}
}
