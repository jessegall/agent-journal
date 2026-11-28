<?php

declare(strict_types=1);

namespace App\Support\Recordings;

use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Agents\Drivers\Contracts\PinnedBuilds;
use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Support\Recordings\Exceptions\RecordingMissing;
use App\Support\Recordings\Exceptions\RecordingStale;
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

    public function __construct(
        private Files $files,
        private PinnedBuilds $builds,
        private DriverCatalogue $drivers,
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

    /**
     * Every scenario a definition file names, as its driver (or host or installation) and name joined by a slash.
     *
     * @return list<string>
     */
    public function scenarioNames(): array
    {
        $definitions = $this->files->matching(FilePath::in(Place::Project, self::SCENARIOS.'/*/*.json'))->paths();

        return array_map(
            fn (FilePath $definition) => $definition->parent()->name().'/'.basename($definition->name(), '.json'),
            $definitions,
        );
    }

    /**
     * The folder a scenario's recording is kept in: a driver's under its pinned build, the host's and the installer's
     * under their name alone, as they have no build.
     */
    public function folderOf(string $driver, string $name): FilePath
    {
        return FilePath::in(Place::Project, self::FOLDER."/{$driver}/".ltrim("{$this->buildOf($driver)}/{$name}", '/'));
    }

    /**
     * The build a scenario of the driver is recorded for: the driver's pinned one, none for the host or the installer.
     */
    public function buildOf(string $driver): string
    {
        if ($this->drivers->hasFamily($driver)) {
            return $this->builds->versionOf($driver);
        }

        return '';
    }
}
