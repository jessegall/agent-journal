<?php

declare(strict_types=1);

namespace App\Processes\Pages;

use App\Http\Controllers\Processes\ApproveBundlePageController;
use App\Http\Controllers\Processes\ApproveProposalPageController;
use App\Http\Controllers\Processes\ApproveSamplePageController;
use App\Http\Controllers\Processes\RejectProposalPageController;
use App\Http\Controllers\Processes\StopRunPageController;
use App\Processes\Readers\RequestListReader;
use App\Processes\Readers\RequestWindowReader;
use App\Processes\Readers\RunsWindowReader;
use App\Processes\Readers\RunWindowReader;
use App\Ui\Contracts\ProvidesPages;
use App\Ui\Declarations\ActionRoute;
use App\Ui\Declarations\DomainUi;
use App\Ui\Declarations\Page;
use App\Ui\Enums\Icon;

/**
 * The project owner's review of command classification (doc 21 revision 6, sections 51 and 71): the requests by
 * state, the active and retired rules and the module bundles waiting, and one request with everything its approval
 * binds.
 */
final class ProcessPages implements ProvidesPages
{
    private const string LIST_VIEW = 'RequestsWindow.vue';

    private const string WINDOW = 'RequestWindow.vue';

    public function pages(): array
    {
        return [$this->listPage(), $this->requestPage(), $this->runsPage(), $this->runPage()];
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
        return Page::make('command-requests', 'Command review', Icon::Rules, RequestListReader::class, self::LIST_VIEW)
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

        return Page::make('command-request', 'Command request', Icon::Rules, RequestWindowReader::class, self::WINDOW)
            ->at('requests/{request}')
            ->actions($sample, $approve, $reject);
    }

    private function runsPage(): Page
    {
        return Page::make('runs', 'Runs', Icon::Rules, RunsWindowReader::class, 'RunsWindow.vue')->at('runs');
    }

    private function runPage(): Page
    {
        return Page::make('run', 'Run', Icon::Rules, RunWindowReader::class, 'RunView.vue')
            ->at('runs/{run}')
            ->actions(ActionRoute::post('runs/{run}/stop', StopRunPageController::class, 'stop-run'));
    }
}
