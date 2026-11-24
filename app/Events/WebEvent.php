<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Events\Event;

/**
 * A fact about pages and views open in a browser: every event of that subject extends it, so a listener typed on it
 * hears them all.
 */
abstract readonly class WebEvent implements Event {}
