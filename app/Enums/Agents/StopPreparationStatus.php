<?php

declare(strict_types=1);

namespace App\Enums\Agents;

/**
 * Where preparing a stop stands: still preparing, ready for the final checks, handed back to the actor with what to
 * do, or held because it cannot go on.
 */
enum StopPreparationStatus: string
{
    case Preparing = 'preparing';
    case FinalChecks = 'final_checks';
    case ReturnToActor = 'return_to_actor';
    case Held = 'held';
}
