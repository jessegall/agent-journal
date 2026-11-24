<?php

declare(strict_types=1);

namespace App\Contracts\Sessions;

use App\Support\ExecutionReceipt;
use App\Support\ExecutionReference;
use App\Support\ExitReceipt;
use App\Support\PreparedStart;

/**
 * The host boundary that starts and stops a prepared start; the protected host implements it, nothing else spawns
 * a driver.
 */
interface StartExecutor
{
    /**
     * Runs the prepared start on its host, and says how it went.
     */
    public function start(PreparedStart $start): ExecutionReceipt;

    /**
     * Stops the running execution, and says how it ended.
     */
    public function stop(ExecutionReference $execution): ExitReceipt;
}
