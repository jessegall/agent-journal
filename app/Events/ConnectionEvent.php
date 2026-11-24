<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Events\Event;

/**
 * A fact about projects, their bindings, invitations and installs: every event of that subject extends it, so a
 * listener typed on it hears them all.
 */
abstract readonly class ConnectionEvent implements Event {}
