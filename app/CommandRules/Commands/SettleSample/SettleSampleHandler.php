<?php

declare(strict_types=1);

namespace App\CommandRules\Commands\SettleSample;

use App\Bus\Contracts\CommandHandler;
use App\CommandRules\Enums\RequestStatus;
use App\CommandRules\Exceptions\RequestTransitionRefused;
use App\CommandRules\Exceptions\SampleRefused;
use App\CommandRules\Values\ExitBranch;
use App\CommandRules\Values\SampleOutcome;
use App\Models\CommandRules\CommandRequest;
use App\Models\CommandRules\EvidencePermit;
use App\Models\Runs\ProcessRun;

final readonly class SettleSampleHandler implements CommandHandler
{
    /**
     * @throws SampleRefused
     * @throws RequestTransitionRefused
     */
    public function handle(SettleSampleCommand $command): SampleOutcome
    {
        $request = CommandRequest::findLockedForChange($command->commandRequestId);

        if ($request->status !== RequestStatus::CapturingSample) {
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

        return new SampleOutcome($request->status, $run->id, $this->unsampledStatuses($request, $permit));
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
