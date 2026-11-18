<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Agents\Support\ExecutionReceipt;
use App\Agents\Support\ExecutionReference;
use App\Agents\Support\ExitReceipt;
use App\Agents\Support\PreparedLaunch;

/**
 * The host boundary that starts and stops a prepared launch; the protected host implements it, nothing else spawns
 * a program.
 */
interface LaunchExecutor
{
    public function start(PreparedLaunch $launch): ExecutionReceipt;

    public function stop(ExecutionReference $execution): ExitReceipt;
}
