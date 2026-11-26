<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Connections\Contracts\ProjectBindingEvent;

/**
 * A runtime holds a project binding until the time given.
 */
final readonly class ProjectBindingLeased implements ConnectionEvent, ProjectBindingEvent
{
    public function __construct(public string $bindingId, public string $runtimeId) {}
}
