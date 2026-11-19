<?php

declare(strict_types=1);

namespace App\Assignments\Support;

use App\Assignments\Contracts\AssigneeProvider;

/**
 * Which provider answers for one registered type of assignee, an actor type or a desk, by its type text.
 */
final readonly class AssigneeRegistration
{
    /**
     * @param  class-string<AssigneeProvider>  $providerClass
     */
    public function __construct(
        public string $type,
        public string $providerClass,
    ) {}
}
