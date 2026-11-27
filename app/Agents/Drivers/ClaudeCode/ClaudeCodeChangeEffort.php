<?php

declare(strict_types=1);

namespace App\Agents\Drivers\ClaudeCode;

use App\Agents\Drivers\Contracts\DriverKeyScript;
use App\Agents\Drivers\DefaultDrivers;
use App\Terminals\KeyScripts\KeyScript;
use App\Terminals\KeyScripts\KeyStep;

/**
 * Changes Claude Code's effort level by naming it on the /effort command line; Claude Code draws an argument hint
 * after the command, so the echo is its words, not the line as typed.
 */
final readonly class ClaudeCodeChangeEffort implements DriverKeyScript
{
    public function __invoke(): KeyScript
    {
        $steps = [
            ...KeyScript::command('/effort {effort}', '❯ /effort', '{effort}'),
            KeyStep::evidence('see the effort applied', 'set effort level to {effort}'),
        ];

        $build = ClaudeCodeKeyScriptBuild::BUILD;

        return new KeyScript('ChangeEffort', DefaultDrivers::CLAUDE_CODE, $build, ['effort'], $steps);
    }
}
