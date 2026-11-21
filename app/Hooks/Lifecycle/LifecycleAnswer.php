<?php

declare(strict_types=1);

namespace App\Hooks\Lifecycle;

use App\Hooks\Values\LifecycleCommands;

/**
 * One lifecycle callback's commands, with the origin the engine runs them under.
 */
final readonly class LifecycleAnswer
{
    public function __construct(public LifecycleOrigin $origin, public LifecycleCommands $commands) {}
}
