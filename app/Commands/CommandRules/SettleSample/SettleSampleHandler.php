<?php

declare(strict_types=1);

namespace App\Commands\CommandRules\SettleSample;

use App\Contracts\Bus\CommandHandler;
use App\Enums\CommandRules\RequestState;
use App\Exceptions\RequestTransitionRefused;
use App\Exceptions\SampleRefused;
use App\Models\CommandRules\CommandRequest;
use App\Models\CommandRules\EvidencePermit;
use App\Models\Runs\ProcessRun;
use App\Values\ExitBranch;
use App\Values\SampleOutcome;

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
            throw SampleRefused::notReady($request->nextStep->command);
        }

        $permit = EvidencePermit::query()
            ->sampling($request)
            ->newestConsumedFirst()
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
                $statuses = [...$statuses, ...array_map(fn (ExitBranch $branch) => $branch->status, $branches)];
            }
        }

        return $statuses;
    }
}
