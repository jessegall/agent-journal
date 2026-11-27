<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Codex;

use App\Agents\Drivers\Contracts\DriverKeyScript;
use App\Agents\Drivers\Contracts\PinnedBuilds;
use App\Agents\Drivers\DefaultDrivers;
use App\Terminals\KeyScripts\KeyScript;
use App\Terminals\KeyScripts\KeyStep;

/**
 * Changes Codex's model by naming it on the /model command line, so no picker is walked (user 28775, 28786), for
 * Codex's pinned build.
 */
final readonly class CodexChangeModel implements DriverKeyScript
{
    public function __construct(private PinnedBuilds $builds) {}

    public function __invoke(): KeyScript
    {
        $steps = [
            ...KeyScript::command('/model {model}', '› /model {model}'),
            KeyStep::evidence('see the model applied', 'model changed to {model}'),
        ];
        $build = $this->builds->versionOf(DefaultDrivers::CODEX);

        return new KeyScript('ChangeModel', DefaultDrivers::CODEX, $build, ['model'], $steps);
    }
}
