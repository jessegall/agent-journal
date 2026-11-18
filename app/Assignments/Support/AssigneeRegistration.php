<?php

declare(strict_types=1);

namespace App\Assignments\Support;

use App\Actors\Enums\ActorType;
use App\Assignments\Contracts\AssigneeProvider;

/**
 * Which provider answers for one type of actor that can hold records: Access for users, Core for agents.
 */
final readonly class AssigneeRegistration
{
    /**
     * @param  class-string<AssigneeProvider>  $providerClass
     */
    public function __construct(
        public ActorType $type,
        public string $providerClass,
    ) {}
}
