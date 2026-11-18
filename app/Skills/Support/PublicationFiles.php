<?php

declare(strict_types=1);

namespace App\Skills\Support;

use App\Programs\Values\ProgramKey;
use App\Skills\Models\SkillPublication;
use App\Skills\Programs\ProgramSkillAdapters;
use App\Skills\Values\SkillKey;

/**
 * The files one publication delivers, in its program's layout and a fixed order: a SKILL.md per selected skill from
 * its immutable generation, the files the program needs to discover them, then manifest.json with only safe identities
 * and hashes. Each publication stages in a folder of its own under its
 * generation, so two selections for one target never mix.
 */
final readonly class PublicationFiles
{
    public const string MANIFEST = 'manifest.json';

    /**
     * @param  array<string, string>  $files  bytes by relative path, manifest last
     * @param  array<string, mixed>  $manifest
     */
    private function __construct(
        public string $stagingFolder,
        public array $files,
        public array $manifest,
    ) {}

    public static function of(
        SkillPublication $publication,
        SkillTargets $targets,
        ProgramSkillAdapters $adapters,
    ): self {
        $program = $adapters->for(ProgramKey::from($publication->program));
        $generation = $publication->generation();
        $skills = [];

        foreach ($publication->skill_keys as $key) {
            $entry = $generation->entry($key);

            if ($entry !== null) {
                $skills[$program->skillFile(SkillKey::from($key))] = $entry['markdown'];
            }
        }

        $manifest = [
            'generation' => $generation->id,
            'publication' => $publication->id,
            'session' => $publication->session_id,
            'program' => $publication->program,
            'selection_digest' => $publication->selection_digest,
            'files' => array_map(fn (string $bytes) => hash('sha256', $bytes), $skills),
        ];

        return new self(
            "{$targets->generationsFolder()}/{$generation->id}/{$publication->id}",
            [...$skills, ...$program->supportFiles(), self::MANIFEST => self::manifestText($manifest)],
            $manifest,
        );
    }

    /**
     * @param  array<string, mixed>  $manifest
     */
    private static function manifestText(array $manifest): string
    {
        return json_encode($manifest, JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)."\n";
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
