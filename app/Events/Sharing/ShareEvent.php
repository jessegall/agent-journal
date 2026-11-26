<?php

declare(strict_types=1);

namespace App\Events\Sharing;

use App\Contracts\Events\Event;

/**
 * A fact about shares and the gateway that serves them: every event of that subject implements it, so a listener typed
 * on it receives them all.
 */
interface ShareEvent extends Event {}
