<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Listener;
use App\Events\AccountSettingsRequested;
use App\Models\Account;

/**
 * A start on a saved account names the method that account signed in by, as it is saved, so the host knows which
 * usage its driver reports. An account that is gone names none, and its start is not claimed.
 */
final readonly class NameAccountSignInMethod implements Listener
{
    public function handle(AccountSettingsRequested $requested): void
    {
        if ($requested->account->type !== Account::LINK_TYPE) {
            return;
        }

        $method = Account::methodOf($requested->account->id);

        if ($method === null) {
            return;
        }

        $requested->settings->signInBy($method->value);
    }
}
