<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Codex;

use App\Agents\Drivers\Contracts\DriverKeyScripts;
use App\Agents\Drivers\Contracts\PinnedBuilds;
use App\Agents\Drivers\DefaultDrivers;
use App\Terminals\KeyScripts\KeyScript;
use App\Terminals\KeyScripts\KeyStep;

/**
 * The key scripts recorded for Codex: each goes through the /model picker and ends on Codex's own line saying the
 * model changed (recordings codex/0.165.0/keyscripts/model-choice and effort-change).
 */
final readonly class CodexKeyScripts implements DriverKeyScripts
{
    public function __construct(private PinnedBuilds $builds) {}

    /**
     * Codex's key scripts for its pinned build.
     *
     * @return list<KeyScript>
     */
    public function __invoke(): array
    {
        // The model and the reasoning are named on the command line, so no picker is walked (user 28775, 28786).
        $changeModel = [
            ...KeyScript::command('/model {model}', '› /model {model}'),
            KeyStep::evidence('see the model applied', 'model changed to {model}'),
        ];

        $changeEffort = [
            ...KeyScript::command('/model --reasoning={effort}', '› /model --reasoning={effort}'),
            KeyStep::evidence('see the reasoning applied', 'model changed to', ' {effort}'),
        ];

        $driver = DefaultDrivers::CODEX;

        return [
            new KeyScript(
                'ChangeModel',
                $driver,
                $this->builds->versionOf(DefaultDrivers::CODEX),
                ['model'],
                $changeModel,
            ),
            new KeyScript(
                'ChangeEffort',
                $driver,
                $this->builds->versionOf(DefaultDrivers::CODEX),
                ['effort'],
                $changeEffort,
            ),
        ];
    }
}
