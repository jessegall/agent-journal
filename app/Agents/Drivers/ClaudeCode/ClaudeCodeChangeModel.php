<?php

declare(strict_types=1);

namespace App\Agents\Drivers\ClaudeCode;

use App\Agents\Drivers\Contracts\DriverKeyScript;
use App\Agents\Drivers\DefaultDrivers;
use App\Navigation\Enums\NavigationKey;
use App\Terminals\KeyScripts\KeyScript;
use App\Terminals\KeyScripts\KeyStep;

/**
 * Changes Claude Code's model by naming it on the /model command line, so no picker is walked; once a conversation
 * began Claude Code asks first, as it is read again on the new model.
 */
final readonly class ClaudeCodeChangeModel implements DriverKeyScript
{
    public function __invoke(): KeyScript
    {
        $steps = [
            ...KeyScript::pastedCommand('/model {model}', '❯ /model', '{model}'),
            // The dialog opens on its "Yes, switch to <model>" entry, which Enter takes; a fresh session is not asked.
            KeyStep::pressIfShown('confirm the switch', 'Yes, switch to', NavigationKey::Enter->bytes()),
            KeyStep::evidence('see the model applied', 'set model to'),
        ];

        $build = ClaudeCodeKeyScriptBuild::BUILD;

        return new KeyScript('ChangeModel', DefaultDrivers::CLAUDE_CODE, $build, ['model'], $steps);
    }
}
