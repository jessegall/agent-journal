<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Events\Listener;
use App\Enums\SignInMethod;
use App\Events\AccountSettingsRequested;
use App\Models\Account;
use App\Support\ClaudeTokenSignIn;

/**
 * A start on a Claude Code account signed in by a provider token gets its token the way the sign-in proved it: the
 * host opens the token's file on a descriptor the driver is told about, so the token is in no argument or variable.
 * A key account needs nothing here: its own settings.json already names the apiKeyHelper the driver reads.
 */
final readonly class SupplyAccountSecret implements Listener
{
    public function handle(AccountSettingsRequested $requested): void
    {
        if ($requested->account->type !== Account::LINK_TYPE) {
            return;
        }

        if (Account::methodOf($requested->account->id) !== SignInMethod::ProviderToken) {
            return;
        }

        $descriptor = $requested->settings->openForReading(ClaudeTokenSignIn::tokenFileIn($requested->directory));
        $requested->settings->setVariable('CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR', (string) $descriptor);
    }
}
