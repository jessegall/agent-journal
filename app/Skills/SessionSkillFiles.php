<?php

declare(strict_types=1);

namespace App\Skills;

use App\Models\Agents\AgentSession;
use App\Models\Skills\SkillGeneration;
use App\Skills\Contracts\DriverSkills;
use App\Values\SkillKey;

/**
 * The files a session's start is handed, in its driver's layout and a fixed order: a SKILL.md per handed key from the
 * generation the session holds, then the files the driver needs to discover them. The same generation and keys always
 * give the same files.
 */
final readonly class SessionSkillFiles
{
    /**
     * @param  array<string, string>  $files  bytes by path in the driver's folder
     */
    private function __construct(
        public array $files,
    ) {}

    public static function of(AgentSession $session, SkillGeneration $generation, DriverSkills $driver): self
    {
        $skills = [];

        foreach ($session->skill_keys ?? [] as $key) {
            $entry = $generation->entry($key);

            if ($entry !== null) {
                $skills[$driver->skillFile(SkillKey::from($key))] = $entry->markdown;
            }
        }

        return new self([...$skills, ...$driver->supportFiles()]);
    }
}
