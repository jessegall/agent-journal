<?php

declare(strict_types=1);

namespace App\Support;

use App\Models\SkillPublication;
use App\Support\Drivers\DriverSkillAdapters;
use App\Values\DriverKey;
use App\Values\PublicationManifest;
use App\Values\SkillKey;

/**
 * The files one publication delivers, in its driver's layout and a fixed order: a SKILL.md per selected skill from
 * its immutable generation, the files the driver needs to discover them, then manifest.json with only safe identities
 * and hashes. Each publication stages in a folder of its own under its
 * generation, so two selections for one target never mix.
 */
final readonly class PublicationFiles
{
    public const string MANIFEST = 'manifest.json';

    /**
     * @param  array<string, string>  $files  bytes by relative path, manifest last
     */
    private function __construct(
        public string $stagingFolder,
        public array $files,
        public PublicationManifest $manifest,
    ) {}

    public static function of(
        SkillPublication $publication,
        SkillTargets $targets,
        DriverSkillAdapters $adapters,
    ): self {
        $driver = $adapters->for(DriverKey::from($publication->skill_protocol));
        $generation = $publication->generation();
        $skills = [];

        foreach ($publication->skill_keys as $key) {
            $entry = $generation->entry($key);

            if ($entry !== null) {
                $skills[$driver->skillFile(SkillKey::from($key))] = $entry['markdown'];
            }
        }

        $manifest = new PublicationManifest(
            $generation->id,
            $publication->id,
            $publication->session_id,
            $publication->skill_protocol,
            $publication->selection_digest,
            array_map(fn (string $bytes) => hash('sha256', $bytes), $skills),
        );

        return new self(
            "{$targets->generationsFolder()}/{$generation->id}/{$publication->id}",
            [...$skills, ...$driver->supportFiles(), self::MANIFEST => $manifest->text()],
            $manifest,
        );
    }

    public function count(): int
    {
        return count($this->files);
    }

    /**
     * The next files to stage after the ones already staged, at most this many.
     *
     * @return array<string, string>
     */
    public function batchAfter(int $staged, int $most): array
    {
        return array_slice($this->files, $staged, $most, true);
    }
}
