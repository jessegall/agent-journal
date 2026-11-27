<?php

declare(strict_types=1);

namespace App\Stacks\Support;

use App\Models\Drivers\DriverRequest;
use App\Stacks\Decisions\StateReferenceFactory;
use App\Stacks\References\StateReference;
use App\Stacks\References\SubjectReference;
use App\Values\StackTarget;

/**
 * Builds the state that owns one effort change of a session, from the driver request that carries it.
 */
final class ChangeEffortStateReference extends StateReferenceFactory
{
    public static function key(): string
    {
        return 'core.drivers.change_effort';
    }

    public static function forRequest(DriverRequest $request, StackTarget $target): StateReference
    {
        return self::about(new SubjectReference($request->id, 0), [
            'agentId' => $target->agentId,
            'sessionId' => $target->sessionId,
            'requestId' => $request->id,
            'effort' => (string) $request->effort,
        ]);
    }
}
