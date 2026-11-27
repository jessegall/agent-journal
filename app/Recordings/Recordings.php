<?php

declare(strict_types=1);

namespace App\Recordings;

use App\Agents\Drivers\Contracts\PinnedBuilds;
use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Recordings\Exceptions\RecordingMissing;
use App\Recordings\Exceptions\RecordingStale;
use App\Values\FilePath;

/**
 * Reads a recorded scenario of a driver's pinned build, or of the installer, with its manifest and exchanges; one never
 * recorded, or recorded before its scenario, protocol, format or agent image changed, fails by name.
 */
final readonly class Recordings
{
    public const string FOLDER = 'resources/recordings';

    /**
     * The scenarios' definitions, each a list of steps, under the driver they record.
     */
    public const string SCENARIOS = 'resources/recordings/scenarios';

    public const string INSTALLATION = 'installation';

    public function __construct(
        private Files $files,
        private PinnedBuilds $builds,
        private AgentImagePrograms $imagePrograms,
    ) {}

    /**
     * @throws RecordingMissing
     * @throws RecordingStale
     */
    public function scenario(string $driver, string $name): ScenarioRecording
    {
        $folder = $this->folderOf($driver, $name);
        $definition = FilePath::in(Place::Project, self::SCENARIOS."/{$driver}/{$name}.json");
        $scenario = "{$driver}/{$name}";

        if (! $this->files->exists($definition)) {
            throw RecordingMissing::of($scenario, 'definition in '.self::SCENARIOS);
        }

        if (! $this->files->exists($folder->child('scenario.json'))) {
            throw RecordingMissing::of($scenario, "recording in {$folder->relative}");
        }

        $manifest = RecordingManifest::fromFile($this->files->readJson($folder->child('scenario.json')));
        $reason = $manifest->staleReasonFor($this->files->digest($definition), $this->imagePrograms->hash());

        if ($reason !== null) {
            throw RecordingStale::of($scenario, $reason);
        }

        $exchanges = [];

        foreach ($manifest->exchanges as $exchange) {
            $exchanges[$exchange] = $this->files->readJson($folder->child("exchanges/{$exchange}/exchange.json"));
        }

        return ScenarioRecording::of($manifest, $exchanges);
    }

    private function folderOf(string $driver, string $name): FilePath
    {
        if ($driver === self::INSTALLATION) {
            return FilePath::in(Place::Project, self::FOLDER."/{$driver}/{$name}");
        }

        return FilePath::in(Place::Project, self::FOLDER."/{$driver}/{$this->builds->versionOf($driver)}/{$name}");
    }
}
