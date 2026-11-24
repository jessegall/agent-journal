<?php

declare(strict_types=1);

namespace App\Contracts\Connections;

use App\Contracts\Events\Event;

/**
 * A change to the binding of a project to an environment.
 */
interface ProjectBindingEvent extends Event {}
