<?php

declare(strict_types=1);

namespace App\Stacks\Contracts\Work;

/**
 * A state every session's stack opens with on its base, above the ready state, for the session's whole life: it never
 * finishes, and an agent with nothing above its base rests.
 */
interface BaseState {}
