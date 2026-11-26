<?php

declare(strict_types=1);

namespace App\Events\Links;

use App\Contracts\Events\Event;

/**
 * A fact about links between records: every event of that subject implements it, so a listener typed on it receives them all.
 */
interface LinkEvent extends Event {}
