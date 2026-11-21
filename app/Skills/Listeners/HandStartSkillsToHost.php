<?php

declare(strict_types=1);

namespace App\Skills\Listeners;

use App\Agents\Events\StartGrantRequested;
use App\Agents\Exceptions\StartRefused;
use App\Agents\Models\AgentSession;
use App\Agents\Support\StartFile;
use App\Agents\Support\StartFolder;
use App\Contracts\Listener;
use App\Drivers\Values\DriverKey;
use App\Skills\Drivers\DriverSkillAdapters;
use App\Skills\Enums\PublicationState;
use App\Skills\Models\SkillPublication;
use App\Skills\Support\PublicationFiles;
use App\Skills\Support\SkillTargets;

/**
 * Hands the host a session's delivered skill set with its grant: the files to write in the start's settings folder
 * and the arguments that point the program at them, and records the generation it spawns with. A set that is not
 * delivered refuses the grant, so nothing spawns without it.
 */
final readonly class HandStartSkillsToHost implements Listener
{
    public function __construct(
        private DriverSkillAdapters $adapters,
        private SkillTargets $targets,
    ) {}

    public function handle(StartGrantRequested $event): void
    {
        $publication = SkillPublication::latestOfSession($event->sessionId);

        if ($publication === null) {
            return;
        }

        if ($publication->state !== PublicationState::Delivered) {
            throw StartRefused::skillsNotReady($event->sessionId, $publication->error ?? $publication->state->value);
        }

        $delivery = $this->adapters->for(DriverKey::from($publication->driver))->delivery();
        $files = PublicationFiles::of($publication, $this->targets, $this->adapters)->files;
        $event->additions->addFolder(new StartFolder(
            $delivery->folder,
            array_map(fn (string $path) => new StartFile($path, $files[$path]), array_keys($files)),
            $delivery->folderArguments,
        ));
        AgentSession::byId($event->sessionId)->recordSkillGeneration($publication->generation_id);
    }
}
