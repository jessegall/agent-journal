<?php

declare(strict_types=1);

namespace App\Pipes\StateLoading;

use App\Contracts\Bus\Pipe;
use App\Exceptions\StateValuesRefused;
use App\Support\StateLoading\DraftState;
use App\Support\StateLoading\StateArguments;
use App\Support\States\AgentState;
use Illuminate\Container\Container;
use TypeError;

/**
 * Makes the state with its collaborators and its constructor's data. The runner keeps this pipe for the worker's life,
 * so the state is made by the container of the request in hand, asked at each call.
 */
final readonly class MakeState implements Pipe
{
    /**
     * @throws StateValuesRefused when a constructor value is not of its parameter's type
     */
    public function handle(StateArguments $arguments): DraftState
    {
        return new DraftState($arguments->type, $this->make($arguments), $arguments->propertyValues);
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
