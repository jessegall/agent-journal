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
    private function __construct(public string $name, public string $installationName) {}

    public static function of(string $name, ScenarioRecording $recording): self
    {
        foreach ($recording->calls(Wire::Docker) as $call) {
            $installation = self::installationOf($call);

            if ($installation !== '') {
                return new self($name, $installation);
            }
        }

        // A scenario whose containers mount no volume names no installation, so the test host's own one serves.
        return new self($name, TestHost::INSTALLATION_NAME);
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
