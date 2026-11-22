<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Listener;
use App\Enums\PublicationState;
use App\Events\StartGrantRequested;
use App\Exceptions\StartRefused;
use App\Models\AgentSession;
use App\Models\SkillPublication;
use App\Support\Drivers\DriverSkillAdapters;
use App\Support\PublicationFiles;
use App\Support\SkillTargets;
use App\Support\StartFile;
use App\Support\StartFolder;
use App\Values\DriverKey;

/**
 * Hands the host a session's delivered skill set with its grant: the files to write in the start's settings folder
 * and the arguments that point the driver at them, and records the generation it spawns with. A set that is not
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

        $delivery = $this->adapters->for(DriverKey::from($publication->skill_protocol))->delivery();
        $files = PublicationFiles::of($publication, $this->targets, $this->adapters)->files;

        $event->additions->addFolder(new StartFolder(
            $delivery->folder,
            array_map(fn (string $path) => new StartFile($path, $files[$path]), array_keys($files)),
            $delivery->folderArguments,
        ));

        AgentSession::byId($event->sessionId)->recordSkillGeneration($publication->generation_id);
    }
}
