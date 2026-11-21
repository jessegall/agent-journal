<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\AgentColumns\Models;

use App\Agents\Support\AgentContext;
use App\Agents\Values\StackTarget;
use Illuminate\Database\Eloquent\Model;

/**
 * A planted wrong model: it is started for a stack and reads the agent that works on it.
 */
final class PlantedJob extends Model
{
    public function startFor(StackTarget $target): void {}

    public function worker(AgentContext $context): string
    {
        return $context->agentId;
    }
}
