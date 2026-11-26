<?php

declare(strict_types=1);

namespace App\CommandRules\Commands\StartSample;

use App\Bus\Contracts\CommandHandler;
use App\CommandRules\Enums\RequestStatus;
use App\CommandRules\Exceptions\EvidencePermitRefused;
use App\CommandRules\Exceptions\RequestTransitionRefused;
use App\CommandRules\Exceptions\SampleRefused;
use App\Models\CommandRules\CommandRequest;
use App\Models\CommandRules\EvidencePermit;
use App\Processes\EvidenceRuns;

/**
 * Starts the request's approved sample as an evidence-only run and records that the request is capturing it. Before
 * the owner approved a sample there is nothing to start, and the answer names the step that waits.
 */
final readonly class StartSampleHandler implements CommandHandler
{
    public function __construct(private EvidenceRuns $evidence) {}

    /**
     * @throws SampleRefused
     * @throws EvidencePermitRefused
     * @throws RequestTransitionRefused
     */
    public function handle(StartSampleCommand $command): string
    {
        $request = CommandRequest::findLockedForChange($command->commandRequestId);

        $permit = EvidencePermit::query()
            ->whereKey($command->permitId)
            ->ofCommandRequest($request->id)
            ->lockForUpdate()
            ->first();

        if ($permit !== null && $permit->wasStartedBy($command->requestKey)) {
            return (string) $permit->process_run_id;
        }

        if ($permit === null || $request->status !== RequestStatus::ReadyForSample) {
            throw SampleRefused::notReady($request->nextStep->command);
        }

        $run = $this->evidence->start($permit, $command->dispatchedBy(), $command->requestKey);
        $request->startSample();

        return $run->getKey();
    }
}
