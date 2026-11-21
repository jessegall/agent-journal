<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Agents\Exceptions\AccountUnavailable;
use App\Agents\Values\SelectedAccount;
use App\Drivers\Enums\HookDriver;

/**
 * The account a start of a program runs with, read and locked inside the start's transaction: selection before
 * account, after the agent's lifecycle lock. It is a privileged read for the start alone, never for a request.
 */
interface ActiveAccountReader
{
    /**
     * @throws AccountUnavailable
     */
    public function forStart(HookDriver $driver): SelectedAccount;
}
