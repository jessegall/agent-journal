<?php

declare(strict_types=1);

namespace App\Hooks\Drivers;

use App\Agents\Support\AccountStartSettings;
use App\Hooks\Drivers\CodexAccountProtection;

/**
 * Codex on a saved account: the account folder as CODEX_HOME with its sign-in kept in its own file, no other
 * credential, the shared app-server arrangement whose working root is an empty trusted folder, and each thread's
 * private protection settings; the accounts folder is named to the hook relay so it refuses it while the journal is
 * away.
 */
final readonly class CodexAccountSettings
{
    private const array OTHER_CREDENTIALS = ['OPENAI_API_KEY', 'CODEX_API_KEY'];

    /**
     * @param  list<string>  $startFlags
     * @param  array<string, string>  $accountSettings
     */
    public static function fill(
        AccountStartSettings $settings,
        string $directory,
        string $root,
        array $startFlags,
        array $accountSettings,
    ): void {
        $settings->setVariable('CODEX_HOME', $directory);
        $settings->setVariable('JOURNAL_ACCOUNTS_ROOT', $root);
        $settings->protectWith(CodexAccountProtection::settingsFor());

        foreach (self::OTHER_CREDENTIALS as $variable) {
            $settings->removeVariable($variable);
        }

        foreach ($startFlags as $flag) {
            $settings->passFlag($flag);
        }

        foreach ($accountSettings as $name => $setting) {
            $settings->keepAccountSetting($name, $setting);
        }
    }
}
