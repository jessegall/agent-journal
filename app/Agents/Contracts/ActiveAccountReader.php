<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Agents\Exceptions\AccountUnavailable;
use App\Agents\Values\SelectedAccount;
use App\Drivers\Enums\HookDriver;

/**
 * The account a start of a driver runs with, read and locked inside the start's transaction: selection before
 * account, after the agent's lifecycle lock. It is a privileged read for the start alone, never for a request.
 */
interface ActiveAccountReader
{
    /**
     * @throws AccountUnavailable
     */
    public function forStart(HookDriver $driver): SelectedAccount;

    /**
     * The account the owner chose for this start, at the sign-in the owner reviewed; the saved default stays as it is.
     *
     * @throws AccountUnavailable
     */
    public function chosenForStart(HookDriver $driver, string $accountId, int $reviewedSignIn): SelectedAccount;
}
