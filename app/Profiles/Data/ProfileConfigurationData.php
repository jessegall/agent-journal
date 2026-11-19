<?php

declare(strict_types=1);

namespace App\Profiles\Data;

use App\Profiles\Support\BaseOverride;
use App\Profiles\Values\ProfileBase;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * The top of a proposed profile configuration as it is written: its revision, the overrides per built-in base and the
 * profiles by key, each still in its written form.
 */
#[MapName(SnakeCaseMapper::class)]
final class ProfileConfigurationData extends Data
{
    /**
     * @param  array<string, PolicyOverrideData>  $baseOverrides  by the key of the built-in base they override
     * @param  array<string, array<string, mixed>>  $profiles
     */
    public function __construct(
        public readonly int $revision = 0,
        #[DataCollectionOf(PolicyOverrideData::class)]
        public readonly array $baseOverrides = [],
        public readonly array $profiles = [],
    ) {}

    /**
     * The project's override of each built-in base it names.
     *
     * @return list<BaseOverride>
     */
    public function toBaseOverrides(): array
    {
        return array_map(
            fn (string $base) => new BaseOverride(
                ProfileBase::of($base),
                $this->baseOverrides[$base]->toPolicyOverride(),
            ),
            array_map(strval(...), array_keys($this->baseOverrides)),
        );
    }
}
