<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\Drivers\HoldReason;
use App\Enums\Navigation\NavigationCompletion;
use App\Exceptions\NavigationRaiseRefused;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\NavigationRequest;
use App\Values\NavigationRoundReport;
use App\Values\ScriptProgress;

/**
 * Takes what the host saw after a round of the main agent: the screen after becomes the request's current screen,
 * a proof the host saw proves the request and settles its stalled key script, a proof it did not see sends the main
 * agent back to answering, and the main desk is woken for the next round.
 */
final readonly class NavigationRoundReports
{
    public function __construct(
        private NavigationDispatch $dispatch,
        private NavigationLibrary $library,
    ) {}

    /**
     * @throws NavigationRaiseRefused
     */
    public function apply(DriverRequest $round, NavigationRoundReport $report): void
    {
        $navigation = NavigationRequest::query()
            ->acrossActors()
            ->whereKey($round->navigation_request_id)
            ->lockForUpdate()
            ->firstOrFail();

        if (! $navigation->status->isOpen()) {
            throw NavigationRaiseRefused::ended($navigation->id, $navigation->status->value);
        }

        $navigation->showScreen($report->screen());

        if ($round->navigation_round?->proof !== null) {
            $this->settleProof($navigation, $report);
        }

        $this->dispatch->deliver($navigation);
    }

    private function settleProof(NavigationRequest $navigation, NavigationRoundReport $report): void
    {
        if (! $report->hasObservedProof) {
            $navigation->refuseProof();

            return;
        }

        $navigation->markProven();
        $evidence = 'proven';

        if ($report->steps !== []) {
            $evidence = 'proven, saved as menu entry '.$this->library->save($navigation, $report->steps)->id;
        }

        $stalled = DriverRequest::findLockedById($navigation->driver_request_id);
        $runtime = AgentRuntime::findLockedById($navigation->agent_runtime_id);
        $runtime->holdFor(HoldReason::None);

        if ($navigation->completes === NavigationCompletion::Goal) {
            $stalled->recordScriptProgress(
                new ScriptProgress($navigation->stalled_step, $report->generation, $evidence),
            );

            $stalled->markApplied('navigation');

            return;
        }

        $stalled->recordScriptProgress(
            new ScriptProgress((int) $navigation->next_step, $report->generation, $evidence),
        );

        $stalled->retry();
    }
}
