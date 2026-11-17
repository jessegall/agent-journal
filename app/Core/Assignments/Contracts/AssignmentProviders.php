<?php

declare(strict_types=1);

namespace App\Core\Assignments\Contracts;

use App\Core\Actors\Enums\ActorType;
use App\Core\Assignments\Exceptions\AssignmentTypeUnavailable;

/**
 * The provider that answers for a record type or an actor type, built for this request. Core-private: the writer and
 * the reader ask it; only the composition sites register providers.
 */
interface AssignmentProviders
{
    /**
     * @throws AssignmentTypeUnavailable
     */
    public function recordProvider(string $type): AssignableProvider;

    /**
     * @throws AssignmentTypeUnavailable
     */
    public function assigneeProvider(ActorType $type): AssigneeProvider;
}
