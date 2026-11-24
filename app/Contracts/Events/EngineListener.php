<?php

declare(strict_types=1);

namespace App\Contracts\Events;

use App\Events\EngineTicked;

/**
 * Periodic work on each engine pass: small bounded reads and its own engine maintenance commands, inside the one
 * maintenance
 * scope it declares. The engine calls it each pass; it is not an event listener and sits in no Listeners folder.
 */
interface EngineListener
{
    /**
     * The maintenance capability its commands check, such as starts.silence.
     */
    public function maintenanceScope(): string;

    /**
     * Does the listener's periodic work when the engine ticks.
     */
    public function __invoke(EngineTicked $event): void;
}
