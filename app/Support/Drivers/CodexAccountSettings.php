<?php

declare(strict_types=1);

namespace App\Support\Drivers;

use App\Contracts\Accounts\AccountSettingsFiller;
use App\Support\AccountStartSettings;
use App\Support\Compatibility\DriverCompatibility;

/**
 * Codex on a saved account: the account folder as CODEX_HOME with its sign-in kept in its own file, no other
 * credential, the shared app-server arrangement whose working root is an empty trusted folder, and each thread's
 * private protection settings; the accounts folder is named to the hook relay so it refuses it while the journal is
 * away.
 */
final readonly class CodexAccountSettings implements AccountSettingsFiller
{
    private const array OTHER_CREDENTIALS = [
        'OPENAI_API_KEY',
        'CODEX_API_KEY',
    ];

    public function fill(
        AccountStartSettings $settings,
        string $directory,
        string $root,
        DriverCompatibility $compatibility,
    ): void {
        $settings->setVariable('CODEX_HOME', $directory);
        $settings->setVariable('JOURNAL_ACCOUNTS_ROOT', $root);
        $settings->protectWith(CodexAccountProtection::settingsFor());

        foreach (self::OTHER_CREDENTIALS as $variable) {
            $settings->removeVariable($variable);
        }

        foreach ($compatibility->startFlags as $flag) {
            $settings->passFlag($flag);
        }

        foreach ($compatibility->settings as $name => $setting) {
            $settings->keepAccountSetting($name, $setting);
        }
    }
}
