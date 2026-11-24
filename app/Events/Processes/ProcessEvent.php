<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Contracts\Events\Event;

/**
 * A fact about process runs and command rules: every event of that subject extends it, so a listener typed on it hears
 * them all.
 */
abstract readonly class ProcessEvent implements Event {}
