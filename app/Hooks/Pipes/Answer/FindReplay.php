<?php

declare(strict_types=1);

namespace App\Hooks\Pipes\Answer;

use App\Hooks\CallStages\LockedCall;
use App\Hooks\Drivers\DriverReply;
use App\Hooks\Drivers\Exceptions\ReplayFound;
use App\Hooks\Exceptions\HookDigestChanged;
use App\Hooks\Models\HookCall;
use App\Pipelines\Contracts\Pipe;

/**
 * Leaves the run with the recorded reply of a call answered before, under the stack lock and before anything else
 * runs; the same call id with other input is refused. A new call passes on unchanged.
 */
final readonly class FindReplay implements Pipe
{
    /**
     * @throws ReplayFound
     * @throws HookDigestChanged
     */
    public function handle(LockedCall $locked): LockedCall
    {
        $identity = $locked->call->identity;
        $recorded = HookCall::query()->forHookId($identity->hookId)->first();

        if ($recorded === null) {
            return $locked;
        }

        if (! $recorded->isSameCallAs($identity)) {
            throw HookDigestChanged::forCall($identity->hookId);
        }

        throw ReplayFound::answeredBefore($identity->hookId, DriverReply::fromRecorded($recorded->answer));
    }
}
