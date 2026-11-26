<?php

declare(strict_types=1);

namespace App\Profiles;

use App\Values\OperationGrant;
use App\Values\ResourceRequest;

/**
 * One exact operation a proposal grants, limited to the resources it lists.
 */
final readonly class OperationRule
{
    /**
     * @param  list<ResourceRequest>  $resources
     */
    public function __construct(
        public string $name,
        public array $resources,
    ) {}

    public function grant(): OperationGrant
    {
        return new OperationGrant($this->name, $this->resources);
    }
}
