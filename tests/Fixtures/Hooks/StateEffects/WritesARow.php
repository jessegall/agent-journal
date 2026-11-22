<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\StateEffects;

use App\Hooks\Inputs\StopRequested;
use App\Hooks\States\AgentState;
use Illuminate\Database\Eloquent\Model;

/**
 * A state that writes a model row itself, which the state effects check refuses.
 */
final class WritesARow extends AgentState
{
    public function __construct(private readonly Model $row) {}

    public function onStop(StopRequested $input): null
    {
        $this->row->save();

        return null;
    }
}
