<?php

declare(strict_types=1);

namespace App\Events\Messages;

use App\Contracts\Events\Event;

/**
 * A fact about messages, inboxes and notifications: every event of that subject implements it, so a listener typed on it
 * receives them all.
 */
interface MessageEvent extends Event {}
