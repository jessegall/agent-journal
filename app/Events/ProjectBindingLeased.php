<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Connections\ProjectBindingEvent;

/**
 * A runtime holds a project binding until the time given.
 */
final readonly class ProjectBindingLeased extends ConnectionEvent implements ProjectBindingEvent
{
    public function __construct(public string $bindingId, public string $runtimeId) {}
}
