<?php

declare(strict_types=1);

namespace App\Hooks\Programs;

use App\Agents\Support\AccountLaunchSettings;

/**
 * Codex on a saved account: the account folder as CODEX_HOME with its sign-in kept in its own file, no other
 * credential, and the shared app-server arrangement whose working root is an empty trusted folder.
 */
final readonly class CodexAccountSettings
{
    private const array OTHER_CREDENTIALS = ['OPENAI_API_KEY', 'CODEX_API_KEY'];

    /**
     * @param  list<string>  $launchFlags
     * @param  array<string, string>  $accountSettings
     */
    public static function fill(
        AccountLaunchSettings $settings,
        string $directory,
        array $launchFlags,
        array $accountSettings,
    ): void {
        $settings->setVariable('CODEX_HOME', $directory);

        foreach (self::OTHER_CREDENTIALS as $variable) {
            $settings->removeVariable($variable);
        }

        foreach ($launchFlags as $flag) {
            $settings->passFlag($flag);
        }

        foreach ($accountSettings as $name => $value) {
            $settings->keepAccountSetting($name, $value);
        }
    }
}
