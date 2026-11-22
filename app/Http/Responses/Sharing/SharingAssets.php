<?php

declare(strict_types=1);

namespace App\Http\Responses\Sharing;

use App\Contracts\Files\Files;
use App\Enums\Place;
use App\Exceptions\FileJsonInvalid;
use App\Values\FilePath;

/**
 * The files of the public reader's own build, as its manifest lists them: the only files the share listener serves.
 */
final readonly class SharingAssets
{
    public const string FOLDER = 'build-sharing';

    private const string STYLESHEET = 'resources/css/sharing.css';

    public function __construct(private Files $files) {}

    /**
     * Whether the file is one the sharing manifest lists.
     */
    public function lists(string $file): bool
    {
        return in_array($file, $this->files(), true);
    }

    /**
     * The built stylesheet's path under the build folder, or null before the reader was built.
     */
    public function stylesheet(): string|null
    {
        $entry = $this->manifest()[self::STYLESHEET] ?? null;

        return is_array($entry) && is_string($entry['file'] ?? null) ? $entry['file'] : null;
    }

    public function path(string $file): string
    {
        return public_path(self::FOLDER.'/'.$file);
    }

    /**
     * @return list<string>
     */
    private function files(): array
    {
        $files = [];

        foreach ($this->manifest() as $entry) {
            if (! is_array($entry)) {
                continue;
            }

            $listed = [$entry['file'] ?? null, ...($entry['css'] ?? [])];
            array_push($files, ...array_filter($listed, 'is_string'));
        }

        return $files;
    }

    /**
     * The manifest the build wrote, decoded once while it is unchanged and read again after a new build; none before
     * the reader was built.
     *
     * @return array<array-key, mixed>
     *
     * @throws FileJsonInvalid when the manifest is not JSON
     */
    private function manifest(): array
    {
        $manifest = FilePath::in(Place::Project, 'public/'.self::FOLDER.'/manifest.json');

        return $this->files->exists($manifest) ? $this->files->readJson($manifest) : [];
    }
}
