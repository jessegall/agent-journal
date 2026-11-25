<?php

declare(strict_types=1);

namespace App\Support\Inspection\Queries;

use App\Models\Agents\AgentStackRow;
use App\Models\Drivers\HookCall;
use App\Support\Inspection\Contracts\StackInspectionQuery as StackInspectionQueryContract;
use App\Support\Inspection\InspectedCall;
use App\Support\Inspection\StackInspection;
use App\Support\Stack\StackRestorer;
use App\Values\StackTarget;

/**
 * The named read a signed-in user makes of any agent's stack: an explicit authorized query, never the calling agent's
 * own scope.
 */
final readonly class StackInspectionQuery implements StackInspectionQueryContract
{
    public function __construct(private StackRestorer $restorer) {}

    public function forTarget(StackTarget $target): StackInspection
    {
        $row = AgentStackRow::query()->authorizedFor($target)->firstOrFail();
        $lastCall = $row->links()->among(HookCall::query()->authorizedFor($target))->latest('id')->first();
        $stack = $this->restorer->restore($row->frames, $row->target());

        return StackInspection::of($row, $stack, InspectedCall::optionalOrMissing($lastCall));
    }
}
