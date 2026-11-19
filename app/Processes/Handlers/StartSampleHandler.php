<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Processes\Commands\StartSample;
use App\Processes\Enums\RequestState;
use App\Processes\Exceptions\EvidencePermitRefused;
use App\Processes\Exceptions\RequestTransitionRefused;
use App\Processes\Exceptions\SampleRefused;
use App\Processes\Models\CommandRequest;
use App\Processes\Models\EvidencePermit;
use App\Processes\Support\EvidenceRuns;

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
    public function handle(StartSample $command): string
    {
        $request = CommandRequest::query()->whereKey($command->commandRequestId)->lockForUpdate()->sole();
        $permit = EvidencePermit::query()
            ->whereKey($command->permitId)
            ->where('command_request_id', $request->id)
            ->lockForUpdate()
            ->first();
        if ($permit !== null && $permit->wasStartedBy($command->requestKey)) {
            return (string) $permit->process_run_id;
        }
        if ($permit === null || $request->state !== RequestState::ReadyForSample) {
            throw SampleRefused::notReady($request->nextStep()->command);
        }

        $run = $this->evidence->start($permit, ActorIdentity::of($command->dispatchedBy()), $command->requestKey);
        $request->startSample();

        return $run->id;
    }
}
