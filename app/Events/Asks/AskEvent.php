<?php

declare(strict_types=1);

namespace App\Events\Asks;

use App\Contracts\Events\Event;

/**
 * A fact about asks and the hops that carry them: every event of that subject implements it, so a listener typed on it
 * hears them all.
 */
interface AskEvent extends Event
{
    public string $askId { get; }
}
