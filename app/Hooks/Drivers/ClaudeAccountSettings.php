<?php

declare(strict_types=1);

namespace App\Hooks\Drivers;

use App\Agents\Support\AccountStartSettings;
use App\Hooks\Drivers\ClaudeAccountProtection;

/**
 * Claude Code on a saved account: the account folder as CLAUDE_CONFIG_DIR, an empty Anthropic folder, no other
 * credential, the restricted, explicitly configured invocation the account-free capture checked, and the private
 * protection settings; the accounts folder is named to the hook relay so it refuses it while the journal is away.
 */
final readonly class ClaudeAccountSettings
{
    private const array OTHER_CREDENTIALS = ['ANTHROPIC_API_KEY', 'ANTHROPIC_AUTH_TOKEN', 'CLAUDE_CODE_OAUTH_TOKEN'];

    /**
     * @param  list<string>  $startFlags
     */
    public static function fill(
        AccountStartSettings $settings,
        string $directory,
        string $root,
        array $startFlags,
    ): void {
        $settings->setVariable('CLAUDE_CONFIG_DIR', $directory);
        $settings->setVariable('JOURNAL_ACCOUNTS_ROOT', $root);
        $settings->protectWith(ClaudeAccountProtection::settingsFor($directory, $root));
        $settings->setEmptyFolderVariable('ANTHROPIC_CONFIG_DIR');

        foreach (self::OTHER_CREDENTIALS as $variable) {
            $settings->removeVariable($variable);
        }

        foreach ($startFlags as $flag) {
            $settings->passFlag($flag);
        }
    }
}
