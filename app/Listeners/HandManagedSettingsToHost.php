<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Events\Listener;
use App\Contracts\Files\Files;
use App\Enums\Files\Place;
use App\Events\Sessions\StartGrantRequested;
use App\Support\ArrangementSetting;
use App\Support\MountRules;
use App\Support\StartFile;
use App\Support\StartFolder;
use App\Values\FilePath;

/**
 * Hands a contained session the managed settings Claude Code reads, with its grant: the host writes them into the
 * session's folder and its container mounts that one file read-only where Claude Code looks, so no image holds them.
 */
final readonly class HandManagedSettingsToHost implements Listener
{
    private const string TEMPLATE = 'resources/agents/claude-code-managed-settings.json';

    public function __construct(private ArrangementSetting $arrangement, private Files $files) {}

    public function handle(StartGrantRequested $event): void
    {
        if (! $this->arrangement->arrangement->isContained()) {
            return;
        }

        $settings = $this->files->read(FilePath::in(Place::Project, self::TEMPLATE));

        $event->additions->addFolder(new StartFolder(
            MountRules::MANAGED_SETTINGS_FOLDER,
            [new StartFile(MountRules::MANAGED_SETTINGS_FILE, $settings)],
            [],
        ));
    }
}
