<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

use App\Processes\Values\AdmittedRun;
use App\Processes\Values\RunReceipt;

/**
 * Starts an admitted run's plan. It takes only an admitted run, never shell text.
 */
interface ProcessRunner
{
    public function start(AdmittedRun $run): RunReceipt;
}
