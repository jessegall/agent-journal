<?php

declare(strict_types=1);

namespace App\Data\Skills\Conditions;

use App\Support\Conditions\Named;

/**
 * A stored condition a domain registered by its key, with the parameters that domain's own Data reads.
 */
final class NamedConditionData extends StoredConditionData
{
    /**
     * @param  array<string, mixed>  $parameters  as the registering domain's parameter Data reads them
     */
    public function __construct(
        public readonly int $version,
        public readonly string $key,
        public readonly array $parameters,
    ) {
        $this->type = Named::TYPE;
    }
}
