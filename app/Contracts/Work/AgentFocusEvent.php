<?php

declare(strict_types=1);

namespace App\Contracts\Work;

use App\Contracts\Events\Event;

/**
 * A change to what an agent focuses on: every event of it implements this, so a listener typed on it hears them all.
 */
interface AgentFocusEvent extends Event {}
