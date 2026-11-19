<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Agents\Support\RunningRuntime;
use PhpOption\Option;

/**
 * An actor that runs in runtimes, of which one at a time is current.
 */
interface RunsRuntimes
{
    /**
     * @return Option<RunningRuntime>
     */
    public function currentRuntime(): Option;
}
