<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\AssigneeProvider;

/**
 * Which provider answers for one registered type of assignee, an actor type or a desk, by its type text.
 */
final readonly class AssigneeDefinition
{
    /**
     * @param  string  $providerClass  a class name, refused unless it is an AssigneeProvider
     */
    public function __construct(
        public string $type,
        public string $providerClass,
    ) {}
}
