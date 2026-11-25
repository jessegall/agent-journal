<?php

declare(strict_types=1);

namespace App\Pipes\StateLoading;

use App\Contracts\Bus\Pipe;
use App\Exceptions\StateValuesRefused;
use App\Support\ReflectedMethod;
use App\Support\ReflectedParameter;
use App\Support\ReflectedType;
use App\Support\StateLoading\SavedState;
use App\Support\StateLoading\StateArguments;
use App\Support\StateLoading\StateValues;

/**
 * Casts the saved values the state's constructor takes as data, by parameter name. One that is missing with no
 * default is refused by the type key and version; collaborators are left to the container.
 */
final readonly class CastConstructorValues implements Pipe
{
    /**
     * @throws StateValuesRefused
     */
    public function handle(SavedState $saved): StateArguments
    {
        $arguments = new StateArguments($saved->type, $saved->values);
        $given = [];

        foreach ($this->parametersOf($saved) as $parameter) {
            $declared = $parameter->type();

            if (! $declared->isDefined() || ! StateValues::isData($declared->get())) {
                continue;
            }

            if (array_key_exists($parameter->name(), $saved->values)) {
                $given[$parameter->name()] = $arguments->castValue($parameter->name(), $declared->get());

                continue;
            }

            if (! $parameter->hasDefaultValue()) {
                throw StateValuesRefused::missing($saved->type->key, $saved->type->schemaVersion, $parameter->name());
            }
        }

        return $arguments->withConstructorValues($given);
    }

    /**
     * @return list<ReflectedParameter>
     */
    private function parametersOf(SavedState $saved): array
    {
        return ReflectedType::of($saved->type->stateClass)->constructor()->map(
            fn (ReflectedMethod $constructor) => $constructor->parameters(),
        )->getOrElse([]);
    }
}
