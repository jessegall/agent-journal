<?php

declare(strict_types=1);

namespace App\Contracts\Processes;

use App\Contracts\Events\Event;

/**
 * A change of a process run, from its start by a host to how it ended.
 */
interface ProcessRunEvent extends Event {}
