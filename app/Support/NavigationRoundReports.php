<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\HoldReason;
use App\Enums\NavigationCompletion;
use App\Exceptions\NavigationRaiseRefused;
use App\Models\AgentRuntime;
use App\Models\DriverRequest;
use App\Models\NavigationRequest;
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

        if (! $navigation->state->isOpen()) {
            throw NavigationRaiseRefused::ended($navigation->id, $navigation->state->value);
        }

        $navigation->showScreen($report->screen());

        if ($round->navigationRound()?->proof !== null) {
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

        $stalled = DriverRequest::lockedById($navigation->driver_request_id);
        $runtime = AgentRuntime::lockedById($navigation->agent_runtime_id);
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
