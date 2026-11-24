<?php

declare(strict_types=1);

namespace App\Pipes\StateLoading;

use App\Contracts\Bus\Pipe;
use App\Exceptions\StateValuesRefused;
use App\Support\StateLoading\StateArguments;
use App\Support\StateLoading\StateValues;

/**
 * Casts the saved values of the state's data properties its constructor does not take, written after it is made.
 */
final readonly class CastPropertyValues implements Pipe
{
    /**
     * @throws StateValuesRefused
     */
    public function handle(StateArguments $arguments): StateArguments
    {
        $given = [];

        foreach (StateValues::dataProperties($arguments->type->stateClass) as $property) {
            if (! $property->isPromoted() && array_key_exists($property->name(), $arguments->values)) {
                $given[$property->name()] = $arguments->castValue($property->name(), $property->type()->get());
            }
        }

        return $arguments->withPropertyValues($given);
    }
}
