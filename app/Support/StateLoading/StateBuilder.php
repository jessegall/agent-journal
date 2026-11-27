<?php

declare(strict_types=1);

namespace App\Support\StateLoading;

use App\Pipelines\BuildStatePipeline;
use App\Pipelines\Support\PipelineRunner;
use App\Stacks\AgentState;
use App\Stacks\Exceptions\StateValuesRefused;
use App\Stacks\StateLoading\RegisteredStateType;

/**
 * Builds every state from its values through BuildStatePipeline. A new frame's values are the ones its push gives, a
 * stored frame's the ones it saved.
 */
final readonly class StateBuilder
{
    public function __construct(private PipelineRunner $pipelines) {}

    /**
     * @param  array<string, mixed>  $values
     *
     * @throws StateValuesRefused when a value the state needs is missing or of the wrong type
     */
    public function build(RegisteredStateType $type, array $values): AgentState
    {
        return $this->pipelines->run(BuildStatePipeline::class, new SavedState($type, $values), AgentState::class);
    }
}
