<?php

declare(strict_types=1);

namespace App\Processes\Pages;

use App\Processes\Http\Controllers\ApproveBundlePageController;
use App\Processes\Http\Controllers\ApproveProposalPageController;
use App\Processes\Http\Controllers\ApproveSamplePageController;
use App\Processes\Http\Controllers\CleanRunPageController;
use App\Processes\Http\Controllers\RejectProposalPageController;
use App\Processes\Http\Controllers\StopRunPageController;
use App\Processes\Resolvers\RequestListResolver;
use App\Processes\Resolvers\RequestWindowResolver;
use App\Processes\Resolvers\RunListResolver;
use App\Processes\Resolvers\RunOutcomeWindowResolver;
use App\Processes\Resolvers\RunWindowResolver;
use App\Ui\Contracts\NativePartProvider;
use App\Ui\Contracts\PageProvider;
use App\Ui\Declarations\ActionRoute;
use App\Ui\Declarations\DomainUi;
use App\Ui\Declarations\Page;
use App\Ui\Enums\Icon;

/**
 * The project owner's review of command classification (doc 21 revision 6, sections 51 and 71): the requests by
 * state, the active and retired rules and the module bundles waiting, and one request with everything its approval
 * binds.
 */
final class ProcessPages implements NativePartProvider, PageProvider
{
    /**
     * The native parts the process layouts mount: the bundle activations of the review list, one request's review and
     * one run's live cards with their streamed output.
     *
     * @return list<string>
     */
    public function nativeParts(): array
    {
        return ['BundleApprovals.vue', 'RequestWindow.vue', 'RunView.vue'];
    }

    public function pages(): array
    {
        return [$this->listPage(), $this->requestPage(), $this->runsPage(), $this->runPage(), $this->runOutcomePage()];
    }

    /**
     * The processes pages under their own key, processes, as checked with the domains' declarations.
     */
    public function declarations(): DomainUi
    {
        return DomainUi::of($this, 'Processes', 'App\\Processes', dirname(__DIR__).'/Resources/js');
    }

    private function listPage(): Page
    {
        return Page::layout('command-requests', 'Command review', Icon::Rules, RequestListResolver::class)
            ->at('')
            ->actions(ActionRoute::post('bundles/approval', ApproveBundlePageController::class, 'approve-rule-bundle'));
    }

    private function requestPage(): Page
    {
        $sample = ActionRoute::post(
            'requests/{request}/sample-approval',
            ApproveSamplePageController::class,
            'approve-sample',
        );

        $approve = ActionRoute::post(
            'proposals/{proposal}/approval',
            ApproveProposalPageController::class,
            'approve-proposal',
        );

        $reject = ActionRoute::post(
            'proposals/{proposal}/rejection',
            RejectProposalPageController::class,
            'reject-proposal',
        );

        return Page::layout('command-request', 'Command request', Icon::Rules, RequestWindowResolver::class)
            ->at('requests/{request}')
            ->actions($sample, $approve, $reject);
    }

    private function runsPage(): Page
    {
        return Page::layout('runs', 'Runs', Icon::Rules, RunListResolver::class)->at('runs');
    }

    private function runOutcomePage(): Page
    {
        return Page::make(
            'run-outcome',
            'Run outcome',
            Icon::Rules,
            RunOutcomeWindowResolver::class,
            'RunOutcomeView.vue',
        )->at('runs/{run}/outcome');
    }

    private function runPage(): Page
    {
        return Page::layout('run', 'Run', Icon::Rules, RunWindowResolver::class)
            ->at('runs/{run}')
            ->actions(
                ActionRoute::post('runs/{run}/stop', StopRunPageController::class, 'stop-run'),
                ActionRoute::post('runs/{run}/clean', CleanRunPageController::class, 'clean-run'),
            );
    }
}
