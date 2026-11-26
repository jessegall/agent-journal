<?php

declare(strict_types=1);

namespace App\Skills\Contracts;

use App\Contracts\Events\Event;

/**
 * An event about one session's skills: every one of them names the session.
 */
interface SkillSessionEvent extends Event
{
    public string $sessionId { get; }
}
