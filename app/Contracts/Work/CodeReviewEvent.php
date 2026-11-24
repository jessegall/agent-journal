<?php

declare(strict_types=1);

namespace App\Contracts\Work;

use App\Contracts\Events\Event;

/**
 * A change to a code review: every event of it implements this, so a listener typed on it hears them all.
 */
interface CodeReviewEvent extends Event {}
