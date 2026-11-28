<?php

declare(strict_types=1);

namespace App\Pipes\StateLoading;

use App\Bus\Contracts\Pipe;
use App\Stacks\Exceptions\StateValuesRefused;
use App\Stacks\StateLoading\StateValues;
use App\Support\ReflectedMethod;
use App\Support\ReflectedParameter;
use App\Support\Reflector;
use App\Support\StateLoading\StateArguments;

/**
 * Casts the saved values the state's constructor takes as data, by parameter name. One that is missing with no
 * default is refused by the type key and version; collaborators are left to the container.
 */
final readonly class CastConstructorValues implements Pipe
{
    /**
     * @throws StateValuesRefused
     */
    public function handle(StateArguments $arguments): StateArguments
    {
        $given = [];

        foreach ($this->parametersOf($arguments) as $parameter) {
            $declared = $parameter->type();

            if (! $declared->isDefined() || ! StateValues::isData($declared->get())) {
                continue;
            }

            if (array_key_exists($parameter->name(), $arguments->values)) {
                $given[$parameter->name()] = $arguments->castValue($parameter->name(), $declared->get());

                continue;
            }

            if (! $parameter->hasDefaultValue()) {
                throw StateValuesRefused::missing(
                    $arguments->type->key,
                    $arguments->type->schemaVersion,
                    $parameter->name(),
                );
            }
        }

        return $arguments->withConstructorValues($given);
    }

    /**
     * @return list<ReflectedParameter>
     */
    private function parametersOf(StateArguments $arguments): array
    {
        return Reflector::of($arguments->type->stateClass)->constructor()->map(
            fn (ReflectedMethod $constructor) => $constructor->parameters(),
        )->getOrElse([]);
    }
}
