<?php

declare(strict_types=1);

namespace App\Hooks\StateLoading\Contracts;

use App\Hooks\StateLoading\Contracts\StateLoader;
use App\Hooks\Contracts\WorkOccurrenceGuard;
/**
 * Marks a state loader whose states tick: every state it builds is a TickableState, which the engine calls about once a
 * second. Loaders without the mark are never restored to look for ticks. A ticking type always names the guard that
 * checks its work is still live, so a tick of finished work commits nothing.
 */
interface TickableStateLoader extends StateLoader
{
    public function occurrenceGuard(): WorkOccurrenceGuard;
}
