<?php

declare(strict_types=1);

namespace App\Agents\Drivers\ClaudeCode;

use App\Agents\Drivers\Contracts\PlanPart;
use App\Agents\Values\PlanFile;
use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Support\MountRules;
use App\Values\DriverStart;
use App\Values\FilePath;
use App\Values\PlanAddition;

/**
 * The managed settings a contained Claude Code reads and no session may change: a plan file the container mounts
 * where Claude Code looks for them.
 */
final readonly class ClaudeCodeManagedSettings implements PlanPart
{
    private const string TEMPLATE = 'resources/agents/claude-code-managed-settings.json';

    public function __construct(private Files $files) {}

    public function __invoke(DriverStart $start): PlanAddition
    {
        $settings = $this->files->read(FilePath::in(Place::Project, self::TEMPLATE));

        return new PlanAddition(files: [new PlanFile(MountRules::MANAGED_SETTINGS_FILE, $settings)]);
    }
}
