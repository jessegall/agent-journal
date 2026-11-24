<?php

declare(strict_types=1);

namespace App\Contracts\Connections;

use App\Contracts\Events\Event;

/**
 * A step of an attempt to install the journal into a project.
 */
interface InstallAttemptEvent extends Event {}
