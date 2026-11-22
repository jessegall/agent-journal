<?php

declare(strict_types=1);

namespace App\Data;

use App\Support\PolicyOverride;
use App\Support\RootRule;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * The policy override fields of a proposed profile or base override, as the proposal writes them.
 */
#[MapName(SnakeCaseMapper::class)]
final class PolicyOverrideData extends Data
{
    /**
     * @param  list<string>  $allowPaths
     * @param  list<string>  $removePaths
     * @param  list<ProposedOperationData>  $allowOperations
     * @param  list<string>  $removeOperations
     * @param  list<string>  $denyOperations
     */
    public function __construct(
        public readonly array $allowPaths = [],
        public readonly array $removePaths = [],
        #[DataCollectionOf(ProposedOperationData::class)]
        public readonly array $allowOperations = [],
        public readonly array $removeOperations = [],
        public readonly array $denyOperations = [],
    ) {}

    public function toPolicyOverride(): PolicyOverride
    {
        return new PolicyOverride(
            array_map(RootRule::parse(...), $this->allowPaths),
            array_map(RootRule::parse(...), $this->removePaths),
            array_map(fn (ProposedOperationData $operation) => $operation->toOperationRule(), $this->allowOperations),
            $this->removeOperations,
            $this->denyOperations,
        );
    }
}
