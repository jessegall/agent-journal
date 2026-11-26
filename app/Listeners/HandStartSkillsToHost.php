<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Agents\Drivers\Skills\DriverSkillAdapters;
use App\Contracts\Events\Listener;
use App\Events\Sessions\StartGrantRequested;
use App\Models\Agents\AgentSession;
use App\Models\Skills\SkillGeneration;
use App\Sessions\StartFile;
use App\Sessions\StartFolder;
use App\Skills\SessionSkillFiles;

/**
 * Hands the host the skills its session was handed with its grant: the files to write in the start's settings folder
 * and the arguments that point the driver at them, built from the generation the session holds. A session handed no
 * generation hands nothing.
 */
final readonly class HandStartSkillsToHost implements Listener
{
    public function __construct(
        private DriverSkillAdapters $adapters,
    ) {}

    public function handle(StartGrantRequested $event): void
    {
        $session = AgentSession::findById($event->sessionId);

        if ($session->skill_generation_id === null) {
            return;
        }

        $driver = $this->adapters->forSession($session);
        $delivery = $driver->delivery();
        $generation = SkillGeneration::findById($session->skill_generation_id);
        $files = SessionSkillFiles::of($session, $generation, $driver)->files;

        $event->additions->addFolder(new StartFolder(
            $delivery->folder,
            array_map(fn (string $path) => new StartFile($path, $files[$path]), array_keys($files)),
            $delivery->folderArguments,
        ));
    }
}
