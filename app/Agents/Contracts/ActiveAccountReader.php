<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Agents\Exceptions\AccountUnavailable;
use App\Agents\Support\SelectedAccount;

/**
 * The account a launch of a program runs with, read and locked inside the launch's transaction: selection before
 * account, after the agent's lifecycle lock. It is a privileged read for the launch alone, never for a request.
 */
interface ActiveAccountReader
{
    /**
     * @throws AccountUnavailable
     */
    public function forLaunch(string $program): SelectedAccount;
}
