<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Navigation\UserInterfaceUpdater;

/**
 * What a session's header shows may have changed: its host reported what the driver does, how a request went, that
 * its start runs or ended, or that it lives again after a silence. The pages that show the session read it again,
 * so no state waits for a reload or a click.
 */
final readonly class SessionStateChanged extends SessionEvent implements UserInterfaceUpdater
{
    public function __construct(public string $sessionId) {}
}
