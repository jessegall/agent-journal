<?php

declare(strict_types=1);

namespace App\Pipes\Answer;

use App\Contracts\Pipe;
use App\Exceptions\HookDigestChanged;
use App\Models\HookCall;
use App\Support\CallStages\LockedCall;
use App\Support\Drivers\DriverReply;
use App\Support\Drivers\Exceptions\ReplayFound;

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
