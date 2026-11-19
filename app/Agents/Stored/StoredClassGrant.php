<?php

declare(strict_types=1);

namespace App\Agents\Stored;

use App\Agents\Values\ClassGrant;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * One class grant of an access policy as the JSON column holds it.
 */
final class StoredClassGrant extends Data
{
    /**
     * @param  list<AccessType>  $access
     */
    public function __construct(
        public readonly ResourceAreaType $area,
        #[DataCollectionOf(AccessType::class)]
        public readonly array $access,
    ) {}

    public static function fromClassGrant(ClassGrant $grant): self
    {
        return self::from(['area' => $grant->area, 'access' => $grant->accessTypes]);
    }

    public function toClassGrant(): ClassGrant
    {
        return new ClassGrant($this->area, $this->access);
    }
}
