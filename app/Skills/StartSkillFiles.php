<?php

declare(strict_types=1);

namespace App\Skills;

use App\Agents\Drivers\Skills\DriverSkillAdapters;
use App\Agents\Values\PlanFile;
use App\Models\Agents\AgentSession;
use App\Models\Skills\SkillGeneration;

/**
 * The skill files a session's start writes, each in its driver's skill folder inside the start's files folder: the
 * generation the session was handed, none when it was handed none.
 */
final readonly class StartSkillFiles
{
    public function __construct(private DriverSkillAdapters $adapters) {}

    /**
     * @return list<PlanFile>
     */
    public function of(string $sessionId): array
    {
        $session = AgentSession::findById($sessionId);

        if ($session->skill_generation_id === null) {
            return [];
        }

        $driver = $this->adapters->forSession($session);
        $folder = $driver->delivery()->folder;
        $files = SessionSkillFiles::of($session, SkillGeneration::findById($session->skill_generation_id), $driver)->files;

        return array_map(
            fn (string $path) => new PlanFile("{$folder}/{$path}", $files[$path]),
            array_keys($files),
        );
    }
}
