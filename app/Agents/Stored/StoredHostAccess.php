<?php

declare(strict_types=1);

namespace App\Agents\Stored;

use App\Agents\Enums\ResourceType;
use App\Agents\Values\HostAccess;
use App\Operations\Enums\AccessType;
use Spatie\LaravelData\Data;

/**
 * One host scope of an access policy as the JSON column holds it: its kind, its root or destination and accesses.
 */
final class StoredHostAccess extends Data
{
    /**
     * @param  list<string>  $access  the access type names
     */
    public function __construct(
        public readonly ResourceType $type,
        public readonly string $scope,
        public readonly array $access,
    ) {}

    public static function fromHostAccess(HostAccess $scope): self
    {
        return self::from([
            'type' => $scope->type,
            'scope' => $scope->scope,
            'access' => array_map(fn (AccessType $access): string => $access->value, $scope->accesses),
        ]);
    }

    public function toHostAccess(): HostAccess
    {
        return new HostAccess($this->type, $this->scope, array_map(AccessType::from(...), $this->access));
    }
}
