<?php

declare(strict_types=1);

namespace App\Support\Stored;

use App\Values\AccessPolicy;
use App\Values\HostAccess;
use App\Values\OperationGrant;
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
     * @param  list<StoredHostAccess>  $paths
     * @param  list<StoredHostAccess>  $destinations
     * @param  list<StoredOperationGrant>  $operationGrants
     * @param  list<string>  $denials
     */
    public function __construct(
        #[DataCollectionOf(StoredHostAccess::class)]
        public readonly array $paths,
        #[DataCollectionOf(StoredHostAccess::class)]
        public readonly array $destinations,
        public readonly StoredProcessGrants $processes,
        #[DataCollectionOf(StoredOperationGrant::class)]
        public readonly array $operationGrants,
        public readonly array $denials,
    ) {}

    public static function fromAccessPolicy(AccessPolicy $access): self
    {
        return self::from([
            'paths' => $access->paths,
            'destinations' => $access->destinations,
            'processes' => StoredProcessGrants::fromProcessGrants($access->processes),
            'operation_grants' => array_map(StoredOperationGrant::fromOperationGrant(...), $access->operationGrants),
            'denials' => $access->denials,
        ]);
    }

    public function toAccessPolicy(): AccessPolicy
    {
        $scopes = fn (StoredHostAccess $scope): HostAccess => $scope->toHostAccess();

        return new AccessPolicy(
            array_map($scopes, $this->paths),
            array_map($scopes, $this->destinations),
            $this->processes->toProcessGrants(),
            array_map(
                fn (StoredOperationGrant $grant): OperationGrant => $grant->toOperationGrant(),
                $this->operationGrants,
            ),
            $this->denials,
        );
    }
}
