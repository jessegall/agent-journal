<?php

declare(strict_types=1);

namespace App\Agents\Drivers\ClaudeCode;

use App\Agents\Drivers\Contracts\PlanPart;
use App\Agents\Values\PlanFile;
use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Values\DriverStart;
use App\Values\FilePath;
use App\Values\PlanAddition;

/**
 * The managed settings a contained Claude Code reads and no session may change: a plan file the container mounts
 * where Claude Code looks for them, with the session's own hooks, as only managed hooks run.
 */
final readonly class ClaudeCodeManagedSettings implements PlanPart
{
    /**
     * The plan file of the managed settings, and where Claude Code reads it in its container.
     */
    public const string FILE = 'managed-settings.json';

    public const string TARGET = '/etc/claude-code/managed-settings.json';

    private const string TEMPLATE = 'resources/agents/claude-code-managed-settings.json';

    public function __construct(private Files $files) {}

    public function __invoke(DriverStart $start): PlanAddition
    {
        $settings = $this->files->readJson(FilePath::in(Place::Project, self::TEMPLATE));

        if ($start->hookCommand !== null) {
            $settings['hooks'] = ClaudeCodeHooks::running($start->hookCommand);
        }

        $text = json_encode($settings, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);

        return new PlanAddition(files: [PlanFile::template(self::FILE, $text)]);
    }
}
