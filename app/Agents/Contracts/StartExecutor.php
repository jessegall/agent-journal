<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Agents\Support\ExecutionReceipt;
use App\Agents\Support\ExecutionReference;
use App\Agents\Support\ExitReceipt;
use App\Agents\Support\PreparedStart;

/**
 * The host boundary that starts and stops a prepared start; the protected host implements it, nothing else spawns
 * a driver.
 */
interface StartExecutor
{
    public function start(PreparedStart $start): ExecutionReceipt;

    public function stop(ExecutionReference $execution): ExitReceipt;
}
