<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Connections\ProjectReadEvent;

/**
 * A project read was answered with a file's text.
 */
final readonly class ProjectReadAnsweredWithText extends ConnectionEvent implements ProjectReadEvent
{
    public function __construct(
        public string $readId,
    ) {}
}
