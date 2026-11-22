<?php

declare(strict_types=1);

namespace App\Sharing\Http\Support;

use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use App\Sharing\Commands\ApproveShareRequest\ApproveShareRequestCommand;
use App\Sharing\Commands\CreateShare\CreateShareCommand;
use App\Sharing\Commands\RefreshShareScope\RefreshShareScopeCommand;
use App\Sharing\Support\ShareSummary;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * The owner's commands that end on one share, run through the bus, each answered by opening that share's page.
 */
final readonly class ShareOpener
{
    public function __construct(
        private CommandBus $commands,
        private Redirector $redirect,
    ) {}

    public function create(CreateShareCommand $command): RedirectResponse
    {
        return $this->runAndOpen($command);
    }

    public function approve(ApproveShareRequestCommand $command): RedirectResponse
    {
        return $this->runAndOpen($command);
    }

    public function refreshScope(RefreshShareScopeCommand $command): RedirectResponse
    {
        return $this->runAndOpen($command);
    }

    /**
     * @param  Command<ShareSummary>  $command
     */
    private function runAndOpen(Command $command): RedirectResponse
    {
        $summary = $this->commands->run($command);

        return $this->redirect->to("/sharing/shares/{$summary->shareId}", 303);
    }
}
