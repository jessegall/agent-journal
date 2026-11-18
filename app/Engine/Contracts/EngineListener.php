<?php

declare(strict_types=1);

namespace App\Engine\Contracts;

use App\Contracts\Listener;
use App\Engine\Events\EngineTicked;

/**
 * Periodic work on each engine pass: small bounded reads and its own AllowsEngine commands, inside the one maintenance
 * scope it declares.
 */
interface EngineListener extends Listener
{
    /**
     * The maintenance capability its commands check, such as launches.silence.
     */
    public function maintenanceScope(): string;

    public function __invoke(EngineTicked $event): void;
}
