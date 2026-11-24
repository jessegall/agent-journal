<?php

declare(strict_types=1);

namespace App\Contracts\Work;

use App\Contracts\Events\Event;

/**
 * A change to a merge attempt: every event of it implements this, so a listener typed on it hears them all.
 */
interface MergeAttemptEvent extends Event {}
