<?php

declare(strict_types=1);

namespace App\Agents\Drivers\ClaudeCode;

use App\Agents\Drivers\Contracts\PlanPart;
use App\Values\DriverStart;
use App\Values\PlanAddition;

/**
 * The one file of Claude Code's sign-in its owner's machine keeps for the project between two sessions: the
 * credential it writes in its configuration folder when the Keychain shim refuses the Keychain.
 */
final readonly class ClaudeCodeKeptSignIn implements PlanPart
{
    private const string CREDENTIAL = '.credentials.json';

    public function __invoke(DriverStart $start): PlanAddition
    {
        return new PlanAddition(keptFiles: ['{folder:'.ClaudeCodeOwnTerminalHome::ACCOUNT_FOLDER.'}/'.self::CREDENTIAL]);
    }
}
