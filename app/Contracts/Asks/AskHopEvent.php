<?php

declare(strict_types=1);

namespace App\Contracts\Asks;

use App\Contracts\Events\Event;

/**
 * A change of one step of an ask: assigned, answered, or what came of waking or telling its holder.
 */
interface AskHopEvent extends Event {}
