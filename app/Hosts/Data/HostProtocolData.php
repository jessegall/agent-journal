<?php

declare(strict_types=1);

namespace App\Hosts\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * Host protocol 1 as protocol/host.json writes it, the one source of both sides' code (rule 117, doc 143).
 */
#[MapInputName(SnakeCaseMapper::class)]
final class HostProtocolData extends Data
{
    /**
     * @param  array<string, string>  $statuses  each answer status with what it means
     * @param  array<string, string>  $refusals  each refusal with what it means
     * @param  array<string, HostOrderTraitsData>  $orders  each order type with its traits
     * @param  list<string>  $placeholderKinds  the kinds of {kind:NAME} a plan may hold
     * @param  list<string>  $hostNames  the names the host fills as {host:NAME}
     * @param  array<string, HostProgramData>  $programs  each shipped program by its name
     */
    public function __construct(
        public readonly string $about,
        public readonly int $version,
        public readonly array $statuses,
        public readonly array $refusals,
        #[DataCollectionOf(HostOrderTraitsData::class)]
        public readonly array $orders,
        public readonly array $placeholderKinds,
        public readonly array $hostNames,
        public readonly HostContainedPlanData $containedPlan,
        #[DataCollectionOf(HostProgramData::class)]
        public readonly array $programs,
    ) {}

    /**
     * @return list<string>
     */
    public function orderTypes(): array
    {
        return array_map(strval(...), array_keys($this->orders));
    }

    public function hook(): HostProgramData
    {
        return $this->programs['journal-hook'];
    }
}
