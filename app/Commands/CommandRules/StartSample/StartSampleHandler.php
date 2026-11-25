<?php

declare(strict_types=1);

namespace App\Commands\CommandRules\StartSample;

use App\Contracts\Bus\CommandHandler;
use App\Enums\CommandRules\RequestStatus;
use App\Exceptions\EvidencePermitRefused;
use App\Exceptions\RequestTransitionRefused;
use App\Exceptions\SampleRefused;
use App\Models\CommandRules\CommandRequest;
use App\Models\CommandRules\EvidencePermit;
use App\Support\ActorIdentity;
use App\Support\EvidenceRuns;

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

        $run = $this->evidence->start($permit, ActorIdentity::of($command->dispatchedBy()), $command->requestKey);
        $request->startSample();

        return $run->id;
    }
}
