<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Processes\AdmissionAlreadyStarted;
use App\Api\Processes\AdmissionFetched;
use App\Api\Processes\FetchAdmissionPayload;
use App\Api\Processes\StartableAdmission;
use App\Exceptions\RunAdmissionStale;
use App\Exceptions\RunnerUnavailable;
use App\Models\Runs\ProcessRun;
use App\Processes\RunnerCapability;
use App\Support\StackTransaction;
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
        private StackTransaction $transaction,
    ) {}

    /**
     * @throws RunAdmissionStale
     */
    public function __invoke(
        FetchAdmissionPayload $call,
        ProcessRun $processRun,
        RunnerCapability $runner,
    ): AdmissionFetched {
        abort_unless($runner->isOn(), 503, RunnerUnavailable::switchedOff()->getMessage());

        if ($processRun->isStale() && $processRun->consumed_at === null) {
            throw RunAdmissionStale::because($processRun->stale_reason);
        }

        $eventKey = $this->transaction->run(fn () => $processRun->consumeFor($call->requestKey->value, $this->appKey));

        if ($eventKey === null) {
            return AdmissionAlreadyStarted::from(['runId' => $processRun->id]);
        }

        return StartableAdmission::from([
            'runId' => $processRun->id,
            'eventKey' => $eventKey,
            'dialect' => $processRun->dialect,
            'workingFolder' => $processRun->working_folder,
            'treeDigest' => $processRun->tree_digest,
            'plan' => $processRun->plan,
        ]);
    }
}
