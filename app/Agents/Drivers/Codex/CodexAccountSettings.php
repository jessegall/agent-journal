<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Codex;

use App\Accounts\AccountStartSettings;
use App\Accounts\Contracts\AccountSettingsFiller;
use App\Support\Compatibility\DriverCompatibility;

/**
 * Codex on a saved account: the account folder as CODEX_HOME with its own sign-in file, the shared app-server whose
 * working root is an empty trusted folder, and each thread's private protection settings. The hook relay is told the
 * accounts folder, so it refuses it while the journal is away.
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
