<?php

declare(strict_types=1);

namespace Tests\Fixtures\Drivers;

use App\Agents\Drivers\ClaudeCode\ClaudeCodeKeyScriptBuild;
use App\Agents\Drivers\Contracts\DriverKeyScript;
use App\Agents\Drivers\DefaultDrivers;
use App\Terminals\KeyScripts\KeyScript;
use App\Terminals\KeyScripts\KeyStep;

/**
 * The bare /model command opens the picker in the recorded navigation scenario.
 */
final readonly class ClaudeCodeModelPicker implements DriverKeyScript
{
    public function __invoke(): KeyScript
    {
        return new KeyScript('ChangeModel', DefaultDrivers::CLAUDE_CODE, ClaudeCodeKeyScriptBuild::BUILD, ['model'], [
            ...KeyScript::command('/model', '❯ /model'),
            KeyStep::find('find the requested model', 'model-picker', 'model'),
        ]);
    }
}
