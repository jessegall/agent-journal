<?php

declare(strict_types=1);

namespace App\Agents\Drivers\ClaudeCode;

use App\Agents\Drivers\Contracts\DriverKeyScripts;
use App\Agents\Drivers\DefaultDrivers;
use App\Navigation\Enums\NavigationKey;
use App\Terminals\KeyScripts\KeyScript;
use App\Terminals\KeyScripts\KeyStep;

/**
 * The key scripts recorded for Claude Code: each changes a setting for this session only and ends on Claude
 * Code's own line saying it applied (recordings keyscripts/model-choice and keyscripts/effort-change).
 */
final readonly class ClaudeCodeKeyScripts implements DriverKeyScripts
{
    /**
     * The build whose recordings under resources/recordings/claude-code establish its key scripts.
     */
    private const string KEY_SCRIPTS_BUILD = '2.1.323';

    /**
     * Claude Code's key scripts for the recorded build.
     *
     * @return list<KeyScript>
     */
    public function __invoke(): array
    {
        // The model and the level are named on the command line, so no picker is walked.
        $changeModel = [
            ...KeyScript::pastedCommand('/model {model}', '❯ /model', '{model}'),
            // Once a conversation began Claude Code asks first, as it is read again on the new model; the dialog opens
            // on its "Yes, switch to <model>" entry, which Enter takes. A fresh session is not asked.
            KeyStep::pressIfShown('confirm the switch', 'Yes, switch to', NavigationKey::Enter->bytes()),
            KeyStep::evidence('see the model applied', 'set model to'),
        ];

        // Claude Code draws an argument hint after the command, so the echo is its words, not the line as typed.
        $changeEffort = [
            ...KeyScript::command('/effort {effort}', '❯ /effort', '{effort}'),
            KeyStep::evidence('see the effort applied', 'set effort level to {effort}'),
        ];

        $driver = DefaultDrivers::CLAUDE_CODE;

        return [
            new KeyScript('ChangeModel', $driver, self::KEY_SCRIPTS_BUILD, ['model'], $changeModel),
            new KeyScript('ChangeEffort', $driver, self::KEY_SCRIPTS_BUILD, ['effort'], $changeEffort),
        ];
    }
}
