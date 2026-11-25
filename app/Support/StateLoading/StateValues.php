<?php

declare(strict_types=1);

namespace App\Support\StateLoading;

use App\Exceptions\StateValuesRefused;
use App\Support\DeclaredType;
use App\Support\ReflectedProperty;
use App\Support\ReflectedType;
use App\Support\States\AgentState;
use BackedEnum;
use PhpOption\Option;
use Spatie\LaravelData\Data;
use Throwable;

/**
 * A state's data: every property it declares whose type is a scalar, an array, a backed enum or a Data class. Its frame
 * saves these as JSON; every other property is a collaborator the container gives it, never saved.
 */
final class StateValues
{
    /**
     * The state's data as its frame saves it: an enum by its value, a Data class as its array.
     *
     * @return array<string, mixed>
     */
    public static function of(AgentState $state): array
    {
        $values = [];

        foreach (self::dataProperties($state::class) as $property) {
            $values[$property->name()] = self::saved($property->readFrom($state));
        }

        return $values;
    }

    /**
     * The data properties of the state class, those its parents keep private too, each once by name.
     *
     * @param  class-string<AgentState>  $class
     * @return list<ReflectedProperty>
     */
    public static function dataProperties(string $class): array
    {
        $found = [];
        $type = Option::fromValue(ReflectedType::of($class));

        while ($type->isDefined()) {
            foreach ($type->get()->properties() as $property) {
                $found[$property->name()] ??= $property;
            }

            $type = $type->get()->parent();
        }

        return array_values(array_filter(
            $found,
            fn (ReflectedProperty $property) => ! $property->isStatic()
                && $property->type()->map(self::isData(...))->getOrElse(false),
        ));
    }

    /**
     * Whether a value of the type is data a frame saves: a scalar, an array, a backed enum or a Data class.
     */
    public static function isData(DeclaredType $type): bool
    {
        if (! $type->isNamed()) {
            return false;
        }

        if ($type->isScalar() || $type->isNamedAs('array')) {
            return true;
        }

        return ! $type->isBuiltin() && self::isEnumOrData($type->name());
    }

    /**
     * A saved value as the declared type reads it: an enum from its value, a Data class from its array.
     *
     * @throws StateValuesRefused when the value does not cast
     */
    public static function cast(RegisteredStateType $type, string $name, DeclaredType $declared, mixed $value): mixed
    {
        if ($value === null || $declared->isBuiltin()) {
            return $value;
        }

        if (! self::isEnumOrData($declared->name())) {
            return $value;
        }

        try {
            return $declared->name()::from($value);
        } catch (Throwable $reason) {
            throw StateValuesRefused::mistyped($type->key, $type->schemaVersion, $name, $reason);
        }
    }

    /**
     * Whether the named type is a backed enum or a Data class; false for a name that is no class at all.
     */
    private static function isEnumOrData(string $name): bool
    {
        return ReflectedType::find($name)->filter(
            fn (ReflectedType $type) => $type->implements(BackedEnum::class) || $type->isSubclassOf(Data::class),
        )->isDefined();
    }

    private static function saved(mixed $value): mixed
    {
        return match (true) {
            $value instanceof BackedEnum => $value->value,
            $value instanceof Data => $value->toArray(),
            default => $value,
        };
    }
}
