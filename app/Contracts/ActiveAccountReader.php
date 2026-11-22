<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Exceptions\AccountUnavailable;
use App\Values\SelectedAccount;

/**
 * The account a start of a driver runs with, read and locked inside the start's transaction: selection before
 * account, after the agent's lifecycle lock. It is a privileged read for the start alone, never for a request.
 */
interface ActiveAccountReader
{
    /**
     * @throws AccountUnavailable
     */
    public function forStart(string $driver): SelectedAccount;

    /**
     * The account the owner chose for this start, at the sign-in the owner reviewed; the saved default stays as it is.
     *
     * @throws AccountUnavailable
     */
    public function chosenForStart(string $driver, string $accountId, int $reviewedSignIn): SelectedAccount;
}
