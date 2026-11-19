<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Actors\Contracts\CurrentAuthorizer;
use App\Contracts\CommandHandler;
use App\Processes\Commands\RejectRuleProposal;
use App\Processes\Enums\ProcessAbility;
use App\Processes\Events\RuleRejected;
use App\Processes\Exceptions\RequestTransitionRefused;
use App\Processes\Exceptions\RuleProposalRefused;
use App\Processes\Models\CommandRequest;
use App\Processes\Models\RuleProposal;
use App\Processes\Policies\ProcessAdministrationPolicy;
use App\Processes\Support\ProjectKey;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class RejectRuleProposalHandler implements CommandHandler
{
    public function __construct(
        private CurrentAuthorizer $administration,
        private Dispatcher $events,
        private ProjectKey $projects,
    ) {}

    /**
     * @throws RuleProposalRefused
     * @throws RequestTransitionRefused
     */
    public function handle(RejectRuleProposal $command): string
    {
        $this->administration->authorize(ProcessAdministrationPolicy::class, CommandRequest::class, ProcessAbility::Administer);
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
        $rejected = RuleRejected::forProposal($proposal, $command->reason);
        $this->events->dispatch($rejected);

        return $proposal->id;
    }
}
