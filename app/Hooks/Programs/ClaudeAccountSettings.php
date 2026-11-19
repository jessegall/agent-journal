<?php

declare(strict_types=1);

namespace App\Hooks\Programs;

use App\Agents\Support\AccountLaunchSettings;

/**
 * Claude Code on a saved account: the account folder as CLAUDE_CONFIG_DIR, an empty Anthropic folder, no other
 * credential, and the restricted, explicitly configured invocation the account-free capture checked.
 */
final readonly class ClaudeAccountSettings
{
    private const array OTHER_CREDENTIALS = ['ANTHROPIC_API_KEY', 'ANTHROPIC_AUTH_TOKEN', 'CLAUDE_CODE_OAUTH_TOKEN'];

    /**
     * @param  list<string>  $launchFlags
     */
    public static function fill(AccountLaunchSettings $settings, string $directory, array $launchFlags): void
    {
        $settings->setVariable('CLAUDE_CONFIG_DIR', $directory);
        $settings->pointAtEmptyFolder('ANTHROPIC_CONFIG_DIR');

        foreach (self::OTHER_CREDENTIALS as $variable) {
            $settings->removeVariable($variable);
        }

        foreach ($launchFlags as $flag) {
            $settings->passFlag($flag);
        }
    }
}
