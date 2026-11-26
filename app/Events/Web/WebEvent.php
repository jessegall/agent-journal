<?php

declare(strict_types=1);

namespace App\Events\Web;

use App\Contracts\Events\Event;

/**
 * A fact about pages and views open in a browser: every event of that subject implements it, so a listener typed on it
 * receives them all.
 */
interface WebEvent extends Event {}
