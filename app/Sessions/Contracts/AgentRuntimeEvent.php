<?php

declare(strict_types=1);

namespace App\Sessions\Contracts;

use App\Contracts\Events\Event;

/**
 * A change to a agent runtime: every event of it implements this, so a listener typed on it hears them all.
 */
interface AgentRuntimeEvent extends Event {}
