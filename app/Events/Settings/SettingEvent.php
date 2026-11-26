<?php

declare(strict_types=1);

namespace App\Events\Settings;

use App\Contracts\Events\Event;

/**
 * A fact about settings: every event of that subject implements it, so a listener typed on it receives them all.
 */
interface SettingEvent extends Event {}
