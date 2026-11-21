<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Profiles\Models\Account;
use App\Profiles\Models\AccountUsageTokens;
use App\Profiles\Models\AccountUsageWindow;
use App\Profiles\Values\ThreadTokens;
use App\Profiles\Values\UsageWindowReading;

/**
 * Keeps a reported reading as the newest of its window or thread: the first one makes the row, a newer one replaces
 * it, and an older or repeated one changes nothing.
 */
final readonly class UsageReadings
{
    /**
     * Keeps the window reading in the account's current sign-in generation only; one of an earlier generation is
     * ignored.
     */
    public function recordWindow(Account $account, int $generation, UsageWindowReading $reading): void
    {
        if (! $account->isGeneration($generation)) {
            return;
        }

        $window = AccountUsageWindow::lockedFor($account, $generation, $reading);

        if ($window === null) {
            AccountUsageWindow::create($account, $generation, $reading);

            return;
        }

        if (! $window->isOlderThan($reading->source)) {
            return;
        }

        $window->replaceWith($account->driver, $reading);
    }

    public function recordTokens(Account $account, int $generation, ThreadTokens $tokens): void
    {
        $count = AccountUsageTokens::lockedFor($account, $generation, $tokens);

        if ($count === null) {
            AccountUsageTokens::create($account, $generation, $tokens);

            return;
        }

        if (! $count->isOlderThan($tokens->source)) {
            return;
        }

        $count->replaceWith($account->driver, $tokens);
    }
}
