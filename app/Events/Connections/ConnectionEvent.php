<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Contracts\Events\Event;

/**
 * A fact about projects, their bindings, invitations and installs: every event of that subject implements it, so a
 * listener typed on it receives them all.
 */
interface ConnectionEvent extends Event {}
