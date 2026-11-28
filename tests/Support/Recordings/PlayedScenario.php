<?php

declare(strict_types=1);

namespace Tests\Support\Recordings;

use App\Recordings\Enums\Wire;
use App\Recordings\RecordedCall;
use App\Recordings\ScenarioRecording;
use Tests\Support\Hosts\TestHost;

/**
 * A recorded scenario a test host plays as its Docker daemon, with the installation name its recording was made under:
 * every volume a recorded container mounts starts with it, so the journal that plays the scenario must hold the same.
 */
final readonly class PlayedScenario
{
    /**
     * Where a container's init program sits, which a development machine mounts from its folder of builds.
     */
    private const string INIT_TARGET = '/opt/journal/bin/journal-init';

    /**
     * The folder each driver's image is built from, by the executable its processes run.
     */
    private const array DRIVER_FOLDERS = [
        'claude' => '.docker/drivers/claude-code',
        'codex' => '.docker/drivers/codex',
    ];

    /**
     * @param  array<string, string>  $driverImages  the recorded driver image of each driver folder
     * @param  list<string>  $pinnedImages  the images the recorded host was installed with, which it checked at its start
     */
    private function __construct(
        public string $name,
        public string $installationName,
        public string $agentImage,
        public string $developmentPrograms,
        public array $driverImages,
        public array $pinnedImages,
        public string $securityProfiles,
    ) {}

    public static function of(string $name, ScenarioRecording $recording): self
    {
        $calls = $recording->calls(Wire::Docker);
        $pinned = self::pinnedImagesOf($calls);
        $agentImage = $pinned[0] ?? TestHost::IMAGE;
        $programs = self::developmentProgramsOf($calls);
        $driverImages = self::driverImagesOf($recording->calls(Wire::Host), $agentImage);
        $profiles = self::securityProfilesOf($recording->calls(Wire::Host));

        foreach ($calls as $call) {
            $installation = self::installationOf($call);

            if ($installation !== '') {
                return new self($name, $installation, $agentImage, $programs, $driverImages, $pinned, $profiles);
            }
        }

        // A start's network is named after the installation too, so a scenario that mounts no volume still names it.
        foreach (self::claimedOf($recording->calls(Wire::Host)) as $instruction) {
            $network = (string) (((array) $instruction['payload'])['container']['network'] ?? '');

            // A probe joins no network, named none; a start's own is <installation>-<id>.
            if ($instruction['type'] === 'open_container' && str_contains($network, '-')) {
                return new self(
                    $name,
                    explode('-', $network)[0],
                    $agentImage,
                    $programs,
                    $driverImages,
                    $pinned,
                    $profiles,
                );
            }
        }

        // A scenario whose containers mount no volume and join no network names no installation, so the test host's
        // own one serves.
        return new self($name, TestHost::INSTALLATION_NAME, $agentImage, $programs, $driverImages, $pinned, $profiles);
    }

    /**
     * The folder of security profiles the recorded machine named its containers' profiles from; none when it named
     * none. A playing machine names its own, as the host reads each profile it names.
     *
     * @param  list<RecordedCall>  $calls
     */
    private static function securityProfilesOf(array $calls): string
    {
        foreach (self::claimedOf($calls) as $instruction) {
            $seccomp = (string) (((array) $instruction['payload'])['container']['securityOptions']['seccomp'] ?? '');

            if ($instruction['type'] === 'open_container' && $seccomp !== '') {
                return dirname($seccomp);
            }
        }

        return '';
    }

    /**
     * The driver image of each driver folder as the recorded journal named them: a driver's image is the one its
     * process was opened in, and the one driver never opened in the recording has the allowed image left over.
     *
     * @param  list<RecordedCall>  $calls
     * @return array<string, string>
     */
    private static function driverImagesOf(array $calls, string $agentImage): array
    {
        $allowed = [];
        $opened = [];

        foreach (self::claimedOf($calls) as $instruction) {
            $payload = (array) $instruction['payload'];
            $allowed = $instruction['type'] === 'allow_images' ? (array) $payload['images'] : $allowed;
            $executable = (string) ($payload['argv'][0] ?? '');

            if ($instruction['type'] === 'open_container' && array_key_exists($executable, self::DRIVER_FOLDERS)) {
                $opened[self::DRIVER_FOLDERS[$executable]] = (string) $payload['container']['image'];
            }
        }

        $left = array_values(array_diff($allowed, [$agentImage, ...array_values($opened)]));

        foreach (self::DRIVER_FOLDERS as $folder) {
            $opened[$folder] ??= array_shift($left) ?? '';
        }

        return array_filter($opened);
    }

    /**
     * Every instruction the recorded host claimed, in order, its payload decoded.
     *
     * @param  list<RecordedCall>  $calls
     * @return list<array{type: string, payload: mixed}>
     */
    private static function claimedOf(array $calls): array
    {
        $claimed = [];

        foreach ($calls as $call) {
            if ($call->status === null || ! str_ends_with($call->path, '/host/instructions/claim')) {
                continue;
            }

            foreach ((array) (((array) json_decode($call->body, true))['instructions'] ?? []) as $instruction) {
                $payload = $instruction['payload'] ?? [];
                $claimed[] = [
                    'type' => (string) $instruction['type'],
                    'payload' => is_string($payload) ? json_decode($payload, true) : $payload,
                ];
            }
        }

        return $claimed;
    }

    /**
     * The folder of program builds the recorded journal mounted over the image's own, as a development machine does;
     * none when its containers mounted none.
     *
     * @param  list<RecordedCall>  $calls
     */
    private static function developmentProgramsOf(array $calls): string
    {
        foreach ($calls as $call) {
            if ($call->status !== null || ! str_ends_with($call->path, '/containers/create')) {
                continue;
            }

            foreach ((array) (((array) json_decode($call->body, true))['HostConfig']['Mounts'] ?? []) as $mount) {
                if (($mount['Target'] ?? '') === self::INIT_TARGET) {
                    return dirname((string) $mount['Source']);
                }
            }
        }

        return '';
    }

    /**
     * The images the recorded host checked as it started, before it asked its daemon anything else: the first is the
     * agent image, then the runner's, as the host command is given them.
     *
     * @param  list<RecordedCall>  $calls
     * @return list<string>
     */
    private static function pinnedImagesOf(array $calls): array
    {
        $pinned = [];
        $pings = 0;

        foreach ($calls as $call) {
            if ($call->status !== null) {
                continue;
            }

            $pings += str_ends_with($call->path, '/_ping') ? 1 : 0;

            if ($pings > 1) {
                break;
            }

            if (preg_match('#/images/(.+)/json$#', $call->path, $image) === 1) {
                $pinned[] = urldecode($image[1]);
            }
        }

        return array_values(array_unique($pinned));
    }

    /**
     * The installation name a container create's volumes start with, none for a call that mounts no volume.
     */
    private static function installationOf(RecordedCall $call): string
    {
        if ($call->status !== null || ! str_ends_with($call->path, '/containers/create')) {
            return '';
        }

        $created = (array) json_decode($call->body, true);

        foreach ((array) ($created['HostConfig']['Mounts'] ?? []) as $mount) {
            if (($mount['Type'] ?? '') === 'volume') {
                return explode('-', (string) $mount['Source'])[0];
            }
        }

        return '';
    }
}
