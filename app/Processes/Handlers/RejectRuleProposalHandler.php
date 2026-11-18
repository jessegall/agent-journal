<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Contracts\CommandHandler;
use App\Processes\Commands\RejectRuleProposal;
use App\Processes\Events\RuleRejected;
use App\Processes\Exceptions\RequestTransitionRefused;
use App\Processes\Exceptions\RuleProposalRefused;
use App\Processes\Models\RuleProposal;
use App\Processes\Support\ProjectKey;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class RejectRuleProposalHandler implements CommandHandler
{
    public function __construct(
        private Dispatcher $events,
        private ProjectKey $projects,
    ) {}

    /**
     * @throws RuleProposalRefused
     * @throws RequestTransitionRefused
     */
    public function handle(RejectRuleProposal $command): string
    {
        $proposal = RuleProposal::query()
            ->ofProject($this->projects->current())
            ->whereKey($command->proposalId)
            ->lockForUpdate()
            ->sole();
        $proposal->reject();
        $request = $proposal->commandRequest()->lockForUpdate()->first();
        if ($request !== null) {
            $request->reject();
        }
        $rejected = new RuleRejected($proposal->id, $proposal->author_type, $proposal->author_id, $command->reason);
        $this->events->dispatch($rejected);

        return $proposal->id;
    }
}
