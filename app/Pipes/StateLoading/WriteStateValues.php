<?php

declare(strict_types=1);

namespace App\Pipes\StateLoading;

use App\Bus\Contracts\Pipe;
use App\Stacks\AgentState;
use App\Stacks\Exceptions\StateValuesRefused;
use App\Stacks\StateLoading\StateValues;
use App\Support\StateLoading\DraftState;
use TypeError;

/**
 * Fills in the data properties the constructor did not take, as the frame saved them, and hands on the built state.
 */
final readonly class WriteStateValues implements Pipe
{
    /**
     * @throws StateValuesRefused when a value is not of the property's type
     */
    public function handle(DraftState $draft): AgentState
    {
        foreach (StateValues::dataProperties($draft->type->stateClass) as $property) {
            if (! array_key_exists($property->name(), $draft->propertyValues)) {
                continue;
            }

            try {
                $property->writeTo($draft->state, $draft->propertyValues[$property->name()]);
            } catch (TypeError $reason) {
                $type = $draft->type;

                throw StateValuesRefused::mistyped($type->key, $type->schemaVersion, $property->name(), $reason);
            }
        }

        return $draft->state;
    }
}
