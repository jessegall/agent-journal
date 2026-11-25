<?php

declare(strict_types=1);

namespace App\Events\Engine;

use App\Contracts\Events\Event;

/**
 * A fact about the engine and its ticks: every event of that subject implements it, so a listener typed on it hears them
 * all.
 */
interface EngineEvent extends Event {}
