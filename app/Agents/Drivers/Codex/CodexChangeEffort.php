<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Codex;

use App\Agents\Drivers\Contracts\DriverKeyScript;
use App\Agents\Drivers\Contracts\PinnedBuilds;
use App\Agents\Drivers\DefaultDrivers;
use App\Terminals\KeyScripts\KeyScript;
use App\Terminals\KeyScripts\KeyStep;

/**
 * Changes Codex's reasoning by naming it on the /model command line, for Codex's pinned build.
 */
final readonly class CodexChangeEffort implements DriverKeyScript
{
    public function __construct(private PinnedBuilds $builds) {}

    public function __invoke(): KeyScript
    {
        $steps = [
            ...KeyScript::command('/model --reasoning={effort}', '› /model --reasoning={effort}'),
            KeyStep::evidence('see the reasoning applied', 'model changed to', ' {effort}'),
        ];
        $build = $this->builds->versionOf(DefaultDrivers::CODEX);

        return new KeyScript('ChangeEffort', DefaultDrivers::CODEX, $build, ['effort'], $steps);
    }
}
