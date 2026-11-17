<?php

declare(strict_types=1);

namespace App\Core\Assignments\Exceptions;

use App\Core\Actors\Enums\ActorType;
use LogicException;

final class AssignmentProviderInvalid extends LogicException
{
    public static function forRecords(string $type, string $providerClass): self
    {
        return new self("The provider {$providerClass} of record type {$type} does not implement AssignableProvider.");
    }

    public static function forAssignees(ActorType $type, string $providerClass): self
    {
        return new self("The provider {$providerClass} of actor type {$type->value} does not implement AssigneeProvider.");
    }

    public static function forModel(string $type, string $model): self
    {
        return new self("The record type {$type} is declared assignable, but its model {$model} does not implement Assignable.");
    }
}
