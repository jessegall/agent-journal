<?php

declare(strict_types=1);

namespace App\Contracts\Chat;

use App\Contracts\Events\Event;

/**
 * A change to a message batch: every event of it implements this, so a listener typed on it hears them all.
 */
interface MessageBatchEvent extends Event {}
