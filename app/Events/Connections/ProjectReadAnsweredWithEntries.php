<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Connections\Contracts\ProjectReadEvent;

/**
 * A project read was answered with a folder's entries.
 */
final readonly class ProjectReadAnsweredWithEntries implements ConnectionEvent, ProjectReadEvent
{
    public function __construct(
        public string $readId,
    ) {}
}
