<?php

declare(strict_types=1);

namespace App\Bus\Attributes;

use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use Attribute;

#[Attribute(Attribute::TARGET_CLASS)]
final readonly class Operation
{
    /** @var non-empty-list<AccessType> */
    public array $accessTypes;

    public function __construct(
        public string $name,
        public ResourceAreaType $area,
        AccessType $access,
        AccessType ...$additionalAccess,
    ) {
        $this->accessTypes = [$access, ...array_values($additionalAccess)];
    }
}
