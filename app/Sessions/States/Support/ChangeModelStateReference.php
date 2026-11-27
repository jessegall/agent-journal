<?php

declare(strict_types=1);

namespace App\Sessions\States\Support;

use App\Models\Drivers\DriverRequest;
use App\Stacks\Decisions\StateReferenceFactory;
use App\Stacks\References\StateReference;
use App\Stacks\References\SubjectReference;
use App\Values\StackTarget;

/**
 * Builds the state that owns one model change of a session, from the driver request that carries it.
 */
final class ChangeModelStateReference extends StateReferenceFactory
{
    public static function key(): string
    {
        return 'core.drivers.change_model';
    }

    public static function forRequest(DriverRequest $request, StackTarget $target): StateReference
    {
        return self::about(new SubjectReference($request->id, 0), [
            'agentId' => $target->agentId,
            'sessionId' => $target->sessionId,
            'requestId' => $request->id,
            'model' => (string) $request->model,
        ]);
    }
}
