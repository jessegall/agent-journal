<?php

declare(strict_types=1);

namespace App\Core\Hooks\Inspection;

use App\Core\Hooks\Models\AgentStackRow;
use App\Core\Hooks\Models\HookCall;
use App\Core\Hooks\Storage\StackTarget;

/**
 * The named read a signed-in user makes of any agent's stack: an explicit authorized query, never the calling agent's own scope.
 */
final readonly class StackInspectionQuery
{
    public function forTarget(StackTarget $target): StackInspection
    {
        $row = AgentStackRow::query()->authorizedFor($target)->firstOrFail();
        $lastCall = $row->links()->among(HookCall::query()->authorizedFor($target))->latest('id')->first();

        return StackInspection::fromAgentStackRow($row, InspectedCall::optionalOrMissing($lastCall));
    }
}
