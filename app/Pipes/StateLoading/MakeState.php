<?php

declare(strict_types=1);

namespace App\Pipes\StateLoading;

use App\Bus\Contracts\Pipe;
use App\Stacks\AgentState;
use App\Stacks\Exceptions\StateValuesRefused;
use App\Stacks\StateLoading\StateValues;
use App\Support\StateLoading\StateArguments;
use Illuminate\Container\Container;
use TypeError;

/**
 * Makes the state with its collaborators and its constructor's data. The runner keeps this pipe for the worker's life,
 * so the state is made by the container of the request in hand, asked at each call.
 */
final readonly class MakeState implements Pipe
{
    /**
     * Makes the state with its collaborators and constructor values, then writes its own saved values into it.
     *
     * @throws StateValuesRefused when a constructor value or an own value is not of its declared type
     */
    public function handle(StateArguments $arguments): AgentState
    {
        $state = $this->make($arguments);

        foreach (StateValues::dataProperties($arguments->type->stateClass) as $property) {
            if (! array_key_exists($property->name(), $arguments->propertyValues)) {
                continue;
            }

            try {
                $property->writeTo($state, $arguments->propertyValues[$property->name()]);
            } catch (TypeError $reason) {
                $type = $arguments->type;

                throw StateValuesRefused::mistyped($type->key, $type->schemaVersion, $property->name(), $reason);
            }
        }

        return $state;
    }

    private function make(StateArguments $arguments): AgentState
    {
        try {
            return Container::getInstance()->make($arguments->type->stateClass, $arguments->constructorValues);
        } catch (TypeError $reason) {
            throw StateValuesRefused::mistyped(
                $arguments->type->key,
                $arguments->type->schemaVersion,
                'of its constructor',
                $reason,
            );
        }
    }
}
