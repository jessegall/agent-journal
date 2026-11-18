<?php

declare(strict_types=1);

namespace App\Http\Responses\Sharing;

/**
 * The files of the public reader's own build, as its manifest lists them: the only files the share listener serves.
 */
final readonly class SharingAssets
{
    public const string FOLDER = 'build-sharing';

    private const string STYLESHEET = 'resources/css/sharing.css';

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
            if (is_array($entry)) {
                array_push($files, ...array_filter([$entry['file'] ?? null, ...($entry['css'] ?? [])], 'is_string'));
            }
        }

        return $files;
    }

    /**
     * @return array<string, mixed>
     *
     * @throws \JsonException when the manifest is not JSON
     */
    private function manifest(): array
    {
        $file = public_path(self::FOLDER.'/manifest.json');

        if (! is_file($file)) {
            return [];
        }

        $manifest = json_decode((string) file_get_contents($file), true, 8, JSON_THROW_ON_ERROR);

        return is_array($manifest) ? $manifest : [];
    }
}
