<?php

declare(strict_types=1);

namespace App\Agents\Drivers\ClaudeCode;

use App\Agents\Drivers\Contracts\EnvironmentPart;
use App\Values\DriverStart;
use App\Values\EnvironmentAddition;

/**
 * The environment of Claude Code on its owner's own terminal: a home of the session's own, the configuration folder
 * its kept sign-in is put in, and the installation's PATH, so nothing of the owner's own ~/.claude or Keychain is read.
 */
final readonly class ClaudeCodeOwnTerminalHome implements EnvironmentPart
{
    public const string ACCOUNT_FOLDER = 'account';

    public function __invoke(DriverStart $start): EnvironmentAddition
    {
        return new EnvironmentAddition(
            [
                'HOME={folder:'.ClaudeCodeAccountHome::HOME_FOLDER.'}',
                'CLAUDE_CONFIG_DIR={folder:'.self::ACCOUNT_FOLDER.'}',
                'PATH='.ClaudeCodeAccountHome::INSTALLATION_PATH,
            ],
            [],
            [ClaudeCodeAccountHome::HOME_FOLDER, self::ACCOUNT_FOLDER],
            [],
        );
    }
}
