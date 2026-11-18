<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

/**
 * Marks a state loader whose states tick: every state it builds is a TickableState, which the engine calls about once a
 * second. Loaders without the mark are never restored to look for ticks.
 */
interface TickableStateLoader extends StateLoader {}
