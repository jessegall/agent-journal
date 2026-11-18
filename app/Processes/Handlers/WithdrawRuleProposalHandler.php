<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Processes\Commands\WithdrawRuleProposal;
use App\Processes\Exceptions\RuleProposalRefused;
use App\Processes\Models\RuleProposal;

final readonly class WithdrawRuleProposalHandler implements CommandHandler
{
    public function __construct(private CurrentActor $actors) {}

    /**
     * @throws RuleProposalRefused
     */
    public function handle(WithdrawRuleProposal $command): string
    {
        $proposal = RuleProposal::query()->whereKey($command->proposalId)->lockForUpdate()->sole();
        $proposal->withdraw(ActorIdentity::of($this->actors->actor()));

        return $proposal->id;
    }
}
