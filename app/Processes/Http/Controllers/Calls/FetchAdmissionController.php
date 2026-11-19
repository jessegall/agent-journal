<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers\Calls;

use App\Processes\Calls\AdmissionAlreadyStarted;
use App\Processes\Calls\AdmissionFetched;
use App\Processes\Calls\AdmissionToStart;
use App\Processes\Calls\FetchAdmissionCall;
use App\Processes\Exceptions\RunAdmissionStale;
use App\Processes\Exceptions\RunnerUnavailable;
use App\Processes\Models\ProcessRun;
use App\Processes\Support\RunnerCapability;
use Illuminate\Container\Attributes\Config;

/**
 * Hands out an admitted run's execution material to the request key that consumes it, again to the same key, and
 * to any other key only that it started.
 */
final readonly class FetchAdmissionController
{
    public function __construct(
        #[Config('app.key')]
        private string $appKey,
    ) {}

    /**
     * @throws RunAdmissionStale
     */
    public function __invoke(
        FetchAdmissionCall $call,
        ProcessRun $processRun,
        RunnerCapability $runner,
    ): AdmissionFetched {
        abort_unless($runner->isOn(), 503, RunnerUnavailable::switchedOff()->getMessage());

        if ($processRun->isStale() && $processRun->consumed_at === null) {
            throw RunAdmissionStale::because($processRun->stale_reason);
        }

        $eventKey = $processRun->consumeFor($call->requestKey->value, $this->appKey);

        if ($eventKey === null) {
            return AdmissionAlreadyStarted::from(['runId' => $processRun->id]);
        }

        return AdmissionToStart::from([
            'runId' => $processRun->id,
            'eventKey' => $eventKey,
            'dialect' => $processRun->dialect,
            'workingFolder' => $processRun->working_folder,
            'treeDigest' => $processRun->tree_digest,
            'plan' => $processRun->plan,
        ]);
    }
}
