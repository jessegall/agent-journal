<?php

declare(strict_types=1);

namespace App\Hooks\Pipes\Answer;

use App\Agents\Drivers\Hooks\DriverReply;
use App\Bus\Contracts\Pipe;
use App\Hooks\CallStages\LockedCall;
use App\Hooks\Exceptions\HookDigestChanged;
use App\Models\Drivers\HookCall;
use Closure;

/**
 * Answers a call answered before with its recorded reply, under the stack lock and before the rest of the pipeline
 * runs; the same call id with other input is refused. A new call runs on through the rest.
 */
final readonly class FindReplay implements Pipe
{
    /**
     * @param  Closure(LockedCall): DriverReply  $next
     *
     * @throws HookDigestChanged
     */
    public function handle(LockedCall $locked, Closure $next): DriverReply
    {
        $identity = $locked->call->identity;
        $recorded = HookCall::query()->forHookId($identity->hookId)->first();

        if ($recorded === null) {
            return $next($locked);
        }

        if (! $recorded->isSameCallAs($identity)) {
            throw HookDigestChanged::forCall($identity->hookId);
        }

        return DriverReply::fromRecorded($recorded->answer);
    }
}
