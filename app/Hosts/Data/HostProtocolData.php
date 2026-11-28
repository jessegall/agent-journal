<?php

declare(strict_types=1);

namespace App\Hosts\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * Host protocol 1 as protocol/host.json writes it, the one source of both sides' code.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class HostProtocolData extends Data
{
    /**
     * @param  array<string, string>  $statuses  each answer status with what it means
     * @param  array<string, string>  $refusals  each refusal with what it means
     * @param  array<string, string>  $refusalFacts  each refusal whose facts have a type of the file, with that type
     * @param  array<string, HostInstructionTraitsData>  $instructions  each instruction type with its traits
     * @param  list<string>  $placeholderTypes  the types of {type:NAME} a plan may hold
     * @param  list<string>  $hostNames  the names the host fills as {host:NAME}
     * @param  list<string>  $refusedAnswerNames  the fields a refused answer names, so the journal can say why
     * @param  array<string, list<string>>  $enums  each enum of the file with its values
     * @param  array<string, list<string>>  $goPackages  the Go packages other than hostapi, with the types they hold
     * @param  array<string, HostProgramData>  $programs  each shipped program by its name
     * @param  array<string, array<string, string>>  $types  each shape that crosses the wire, its fields by their types
     * @param  array<string, HostCallData>  $calls  each call the host makes to the journal
     * @param  array<int, RelayProtocolData>  $protocols
     */
    public function __construct(
        public readonly string $about,
        public readonly int $version,
        public readonly array $statuses,
        public readonly array $refusals,
        public readonly array $refusalFacts,
        #[DataCollectionOf(HostInstructionTraitsData::class)]
        public readonly array $instructions,
        public readonly array $placeholderTypes,
        public readonly array $hostNames,
        public readonly array $refusedAnswerNames,
        public readonly HostContainedPlanData $containedPlan,
        public readonly array $enums,
        public readonly array $goPackages,
        #[DataCollectionOf(HostProgramData::class)]
        public readonly array $programs,
        public readonly array $types,
        #[DataCollectionOf(HostCallData::class)]
        public readonly array $calls,
        #[DataCollectionOf(RelayProtocolData::class)]
        public readonly array $protocols,
    ) {}

    /**
     * @return list<string>
     */
    public function instructionTypes(): array
    {
        return array_map(strval(...), array_keys($this->instructions));
    }

    /**
     * The Go package a type or enum of the file lives in: hostapi, unless go_packages names another.
     */
    public function goPackageOf(string $type): string
    {
        foreach ($this->goPackages as $package => $types) {
            if (in_array($type, $types, true)) {
                return $package;
            }
        }

        return 'hostapi';
    }

    public function hook(): HostProgramData
    {
        return $this->programs['journal-hook'];
    }

    public function relayVersion(): int
    {
        return array_key_first($this->protocols);
    }

    /**
     * @return array<string, HostCallData>
     */
    public function relayCalls(): array
    {
        $relay = $this->protocols[$this->relayVersion()];

        return [
            ...array_intersect_key($this->calls, array_fill_keys($relay->sharedCalls, true)),
            ...$relay->calls,
        ];
    }

    /**
     * @return array<string, array<string, string>>
     */
    public function wireTypes(): array
    {
        return [
            ...$this->types,
            ...$this->protocols[$this->relayVersion()]->types,
        ];
    }
}
