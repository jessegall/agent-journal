<?php

declare(strict_types=1);

namespace App\Skills\Support;

use App\Skills\Models\SkillPublication;

/**
 * The files one publication delivers, in a fixed order: a SKILL.md per selected skill from its immutable generation,
 * then manifest.json with only safe identities and hashes. They are staged in a folder of their own per generation and
 * target.
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

    public static function of(SkillPublication $publication, SkillTargets $targets): self
    {
        $generation = $publication->generation();
        $skills = [];

        foreach ($publication->skill_keys as $key) {
            $entry = $generation->entry($key);

            if ($entry !== null) {
                $skills["{$key}/SKILL.md"] = $entry['markdown'];
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
            "{$targets->generationsFolder()}/{$generation->id}/".sha1($publication->target),
            [...$skills, self::MANIFEST => self::manifestText($manifest)],
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
