<?php

declare(strict_types=1);

namespace App\Events\Messages;

use App\Contracts\Events\Event;

/**
 * A fact about messages, inboxes and notifications: every event of that subject extends it, so a listener typed on it
 * hears them all.
 */
abstract readonly class MessageEvent implements Event {}
