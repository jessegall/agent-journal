<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Contracts\Events\Event;

/**
 * A fact about process runs and command rules: every event of that subject implements it, so a listener typed on it receives
 * them all.
 */
interface ProcessEvent extends Event {}
