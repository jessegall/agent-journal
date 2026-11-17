<?php

declare(strict_types=1);

namespace App\Core\Assignments\Support;

use App\Core\Actors\Enums\ActorKind;
use App\Core\Assignments\Contracts\AssigneeProvider;

/**
 * Which provider answers for one kind of actor that can hold records: Access for users, Core for agents.
 */
final readonly class AssigneeRegistration
{
    /**
     * @param  class-string<AssigneeProvider>  $providerClass
     */
    public function __construct(
        public ActorKind $kind,
        public string $providerClass,
    ) {}
}
