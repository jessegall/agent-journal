<?php

declare(strict_types=1);

namespace App\Agents\Stored;

use App\Agents\Values\AccessPolicy;
use App\Agents\Values\ClassGrant;
use App\Agents\Values\OperationGrant;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * An access policy as the JSON column of a profile revision or a session's frozen policy holds it.
 */
#[MapName(SnakeCaseMapper::class)]
final class StoredAccessPolicy extends Data
{
    /**
     * @param  list<StoredClassGrant>  $classGrants
     * @param  list<StoredOperationGrant>  $operationGrants
     * @param  list<string>  $denials
     * @param  list<string>  $paths
     * @param  list<string>  $destinations
     */
    public function __construct(
        #[DataCollectionOf(StoredClassGrant::class)]
        public readonly array $classGrants,
        #[DataCollectionOf(StoredOperationGrant::class)]
        public readonly array $operationGrants,
        public readonly array $denials,
        public readonly array $paths,
        public readonly array $destinations,
        public readonly StoredProcessGrants $processes,
    ) {}

    public static function fromAccessPolicy(AccessPolicy $access): self
    {
        return self::from([
            'class_grants' => array_map(StoredClassGrant::fromClassGrant(...), $access->classGrants),
            'operation_grants' => array_map(StoredOperationGrant::fromOperationGrant(...), $access->operationGrants),
            'denials' => $access->denials,
            'paths' => $access->paths,
            'destinations' => $access->destinations,
            'processes' => StoredProcessGrants::fromProcessGrants($access->processes),
        ]);
    }

    public function toAccessPolicy(): AccessPolicy
    {
        return AccessPolicy::make(
            array_map(fn (StoredClassGrant $grant): ClassGrant => $grant->toClassGrant(), $this->classGrants),
            array_map(
                fn (StoredOperationGrant $grant): OperationGrant => $grant->toOperationGrant(),
                $this->operationGrants,
            ),
            $this->denials,
            $this->paths,
            $this->destinations,
            $this->processes->toProcessGrants(),
        );
    }
}
