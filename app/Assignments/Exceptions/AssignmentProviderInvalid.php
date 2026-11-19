<?php

declare(strict_types=1);

namespace App\Assignments\Exceptions;

use LogicException;

final class AssignmentProviderInvalid extends LogicException
{
    public static function forRecords(string $type, string $providerClass): self
    {
        return new self("The provider {$providerClass} of record type {$type} does not implement AssignableProvider.");
    }

    public static function forAssignees(string $type, string $providerClass): self
    {
        return new self("The provider {$providerClass} of assignee type {$type} does not implement AssigneeProvider.");
    }

    public static function forActivity(string $type, string $activityClass): self
    {
        return new self(
            "The activity {$activityClass} of actor type {$type} does not implement AutoAssignmentActivity.",
        );
    }

    public static function forAutoAssigner(string $type, string $assignerClass): self
    {
        return new self("The auto-assigner {$assignerClass} of record type {$type} does not implement AutoAssigner.");
    }

    public static function forAssignedWork(string $type, string $workProviderClass): self
    {
        return new self(
            "The work provider {$workProviderClass} of record type {$type} does not implement AssignedWorkProvider.",
        );
    }

    public static function forPoolFactory(string $key, string $factoryClass): self
    {
        return new self("The factory {$factoryClass} of pool {$key} does not implement AssignmentPoolFactory.");
    }

    public static function forResolved(string $registeredClass, string $resolvedClass, string $contract): self
    {
        return new self(
            "The container builds {$resolvedClass} for {$registeredClass}, which does not implement {$contract}.",
        );
    }

    public static function forModel(string $type, string $model): self
    {
        return new self(
            "The record type {$type} is declared assignable, but its model {$model} does not implement Assignable.",
        );
    }
}
