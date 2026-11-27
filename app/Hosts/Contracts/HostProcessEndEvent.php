<?php

declare(strict_types=1);

namespace App\Hosts\Contracts;

use App\Sessions\Contracts\SessionFact;

/**
 * A process of a host ended for good: it exited or the host lost it.
 */
interface HostProcessEndEvent extends HostProcessEvent, SessionFact
{
    public string|null $runtimeId { get; }

    public string $evidence { get; }
}
