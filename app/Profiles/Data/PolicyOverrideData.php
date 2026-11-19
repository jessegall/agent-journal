<?php

declare(strict_types=1);

namespace App\Profiles\Data;

use App\Profiles\Support\ClassRule;
use App\Profiles\Support\PolicyOverride;
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
     * @param  list<string>  $allowClasses
     * @param  list<string>  $removeClasses
     * @param  list<ProposedOperationData>  $allowOperations
     * @param  list<string>  $removeOperations
     * @param  list<string>  $denyOperations
     */
    public function __construct(
        public readonly array $allowClasses = [],
        public readonly array $removeClasses = [],
        #[DataCollectionOf(ProposedOperationData::class)]
        public readonly array $allowOperations = [],
        public readonly array $removeOperations = [],
        public readonly array $denyOperations = [],
    ) {}

    public function toPolicyOverride(): PolicyOverride
    {
        return new PolicyOverride(
            array_map(ClassRule::parse(...), $this->allowClasses),
            array_map(ClassRule::parse(...), $this->removeClasses),
            array_map(fn (ProposedOperationData $operation) => $operation->toOperationRule(), $this->allowOperations),
            $this->removeOperations,
            $this->denyOperations,
        );
    }
}
