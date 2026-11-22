<?php

declare(strict_types=1);

namespace App\Processes\Commands\SettleSample;

use App\Contracts\CommandHandler;
use App\Processes\Enums\RequestState;
use App\Processes\Exceptions\RequestTransitionRefused;
use App\Processes\Exceptions\SampleRefused;
use App\Processes\Models\CommandRequest;
use App\Processes\Models\EvidencePermit;
use App\Processes\Models\ProcessRun;
use App\Processes\Values\ExitBranch;
use App\Processes\Values\SampleOutcome;

final readonly class SettleSampleHandler implements CommandHandler
{
    /**
     * @throws SampleRefused
     * @throws RequestTransitionRefused
     */
    public function handle(SettleSampleCommand $command): SampleOutcome
    {
        $request = CommandRequest::lockedForChange($command->commandRequestId);

        if ($request->state !== RequestState::CapturingSample) {
            throw SampleRefused::notReady($request->nextStep()->command);
        }

        $permit = EvidencePermit::query()
            ->sampling($request)
            ->orderByDesc('consumed_at')
            ->orderByDesc('id')
            ->firstOrFail();

        $run = ProcessRun::query()->ownedBy($request->actor())->findOrFail($permit->process_run_id);

        if (! $run->hasEnded()) {
            throw SampleRefused::stillRunning($run->id);
        }

        if ($run->hasCompleteEvidence()) {
            $request->finishSample();
        } else {
            $request->retrySample();
        }

        return new SampleOutcome($request->state, $run->id, $this->unsampledStatuses($request, $permit));
    }

    /**
     * @return list<int>
     */
    private function unsampledStatuses(CommandRequest $request, EvidencePermit $permit): array
    {
        $statuses = [];

        foreach ($permit->candidate_rules as $rule) {
            foreach ($rule->contracts as $contract) {
                $branches = $request->unsampledBranches($contract->exits);
                $statuses = [...$statuses, ...array_map(fn (ExitBranch $branch): int => $branch->status, $branches)];
            }
        }

        return $statuses;
    }
}
