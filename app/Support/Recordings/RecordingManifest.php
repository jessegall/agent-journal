<?php

declare(strict_types=1);

namespace App\Support\Recordings;

use App\Hosts\Protocol\HostProtocol;
use App\Support\Recordings\Enums\StaleReason;
use App\Support\Recordings\Scenarios\Scenario;
use JsonSerializable;

/**
 * What a recorded scenario was made of: the recording format and host protocol, the scenario's digest, the driver
 * and its build, the agent image's build digest, when it was recorded and its exchanges. A recording is
 * stale once any of them no longer holds for the code as it is.
 */
final readonly class RecordingManifest implements JsonSerializable
{
    /**
     * The format of a recording folder; a recording of another format is made again.
     */
    public const int FORMAT = 3;

    private const string IMAGE_BUILD = 'image_build';

    /**
     * @param  list<string>  $exchanges  each exchange's folder name, in order
     */
    private function __construct(
        public int $format,
        public int $protocol,
        public string $scenarioHash,
        public string $driver,
        public string $build,
        public string $imageBuild,
        public string $recordedAt,
        public array $exchanges,
    ) {}

    /**
     * The manifest of a scenario recorded now, in this format and protocol.
     *
     * @param  list<string>  $exchanges
     */
    public static function of(
        string $scenarioHash,
        string $driver,
        string $build,
        string $imageBuild,
        string $recordedAt,
        array $exchanges,
    ): self {
        return new self(
            self::FORMAT,
            self::protocolOf($driver),
            $scenarioHash,
            $driver,
            $build,
            $imageBuild,
            $recordedAt,
            $exchanges,
        );
    }

    /**
     * @param  array<string, mixed>  $manifest
     */
    public static function fromFile(array $manifest): self
    {
        return new self(
            (int) $manifest['format'],
            (int) $manifest['protocol'],
            (string) $manifest['scenario_hash'],
            (string) $manifest['driver'],
            (string) $manifest['build'],
            (string) $manifest[self::IMAGE_BUILD],
            (string) $manifest['recorded_at'],
            array_values(array_map(strval(...), (array) $manifest['exchanges'])),
        );
    }

    /**
     * The first reason the recording no longer stands for the scenario and the agent image as they are now; none
     * while it does.
     */
    public function staleReasonFor(string $scenarioHash, string $imageBuild): StaleReason|null
    {
        return match (true) {
            $this->format !== self::FORMAT => StaleReason::Format,
            $this->protocol < self::protocolOf($this->driver) => StaleReason::Protocol,
            $this->scenarioHash !== $scenarioHash => StaleReason::Scenario,
            $this->imageBuild !== $imageBuild => StaleReason::ImageBuild,
            default => null,
        };
    }

    private static function protocolOf(string $driver): int
    {
        if ($driver === Scenario::CONNECTED) {
            return HostProtocol::RELAY;
        }

        return HostProtocol::ENROLLED;
    }

    /**
     * @return array<string, mixed>
     */
    public function jsonSerialize(): array
    {
        return [
            'format' => $this->format,
            'protocol' => $this->protocol,
            'scenario_hash' => $this->scenarioHash,
            'driver' => $this->driver,
            'build' => $this->build,
            self::IMAGE_BUILD => $this->imageBuild,
            'recorded_at' => $this->recordedAt,
            'exchanges' => $this->exchanges,
        ];
    }
}
