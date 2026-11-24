<?php

declare(strict_types=1);

namespace App\Contracts\Drivers;

use App\Contracts\Events\Event;

/**
 * A step of a switch of an agent to another driver, from its checks to its end.
 */
interface DriverSwitchEvent extends Event {}
