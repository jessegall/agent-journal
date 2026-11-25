<?php

declare(strict_types=1);

namespace App\Events\Hooks;

use App\Contracts\Events\Event;

/**
 * A fact about hook calls and what the work states answer to them: every event of that subject implements it, so a
 * listener typed on it hears them all.
 */
interface HookEvent extends Event {}
