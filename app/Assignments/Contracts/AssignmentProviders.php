<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Actors\Enums\ActorType;
use App\Assignments\Exceptions\AssignmentTypeUnavailable;

/**
 * The provider that answers for a record type or an actor type, built for this request. Core-private: the writer and
 * the reader ask it; only the composition sites register providers.
 */
interface AssignmentProviders
{
    /**
     * Whether a provider answers for this record type.
     */
    public function hasRecordProvider(string $type): bool;

    /**
     * @throws AssignmentTypeUnavailable
     */
    public function recordProvider(string $type): AssignableProvider;

    /**
     * @throws AssignmentTypeUnavailable
     */
    public function assigneeProvider(ActorType $type): AssigneeProvider;
}
