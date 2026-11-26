<?php

declare(strict_types=1);

namespace App\Stacks\Contracts\Work;

/**
 * A state whose frames carry into the session that continues the agent's work; any other state ends with its session.
 */
interface DurableState {}
