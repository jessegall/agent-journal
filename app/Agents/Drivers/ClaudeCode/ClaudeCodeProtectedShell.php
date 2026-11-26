<?php

declare(strict_types=1);

namespace App\Agents\Drivers\ClaudeCode;

use App\Contracts\Drivers\EnvironmentPart;
use App\Values\DriverStart;
use App\Values\EnvironmentAddition;

/**
 * The shell bridge of a protected start, which hands every command, unparsed, to the executor's user.
 */
final readonly class ClaudeCodeProtectedShell implements EnvironmentPart
{
    private const string PROTECTED_SHELL = '/opt/journal/shell/bash';

    /**
     * CLAUDE_CODE_SHELL and IS_SANDBOX.
     */
    public function __invoke(DriverStart $start): EnvironmentAddition
    {
        return new EnvironmentAddition(['CLAUDE_CODE_SHELL='.self::PROTECTED_SHELL, 'IS_SANDBOX=1']);
    }
}
