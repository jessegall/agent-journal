<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Events\Event;

/**
 * A fact about settings: every event of that subject extends it, so a listener typed on it hears them all.
 */
abstract readonly class SettingEvent implements Event {}
