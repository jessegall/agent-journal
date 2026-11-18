<?php

declare(strict_types=1);

namespace App\Sharing\Http\Support;

use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use App\Sharing\Support\ShareSummary;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Runs an owner's command that ends on one share through the bus, then opens that share's page.
 */
final readonly class ShareOpener
{
    public function __construct(
        private CommandBus $commands,
        private Redirector $redirect,
    ) {}

    /**
     * @param  Command<ShareSummary>  $command
     */
    public function runAndOpen(Command $command): RedirectResponse
    {
        $summary = $this->commands->run($command);

        return $this->redirect->to("/sharing/shares/{$summary->shareId}", 303);
    }
}
