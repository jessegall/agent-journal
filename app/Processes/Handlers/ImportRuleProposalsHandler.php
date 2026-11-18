<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Processes\Commands\ImportRuleProposals;
use App\Processes\Declarations\RuleDeclarations;
use App\Processes\Exceptions\DeclarationInvalid;
use App\Processes\Exceptions\RuleProposalRefused;
use App\Processes\Models\RuleProposal;
use App\Processes\Support\ProposalChecks;
use App\Processes\Values\DeclaredProposal;
use App\Processes\Values\ExecutionContext;
use App\Processes\Values\ProposalReceipt;

/**
 * Reads every declaration of the file first and stores nothing when one is refused; then opens one proposal per
 * declaration in the folder's project, authored by the importing actor.
 */
final readonly class ImportRuleProposalsHandler implements CommandHandler
{
    public function __construct(
        private CurrentActor $actors,
        private RuleDeclarations $declarations,
        private ProposalChecks $checks,
    ) {}

    /**
     * @return list<ProposalReceipt>
     *
     * @throws DeclarationInvalid
     * @throws RuleProposalRefused
     */
    public function handle(ImportRuleProposals $command): array
    {
        $actor = ActorIdentity::of($this->actors->actor());
        $projectKey = ExecutionContext::inFolder($command->workingFolder)->projectKey();
        $declared = $this->declarations->read($command->declarations);
        foreach ($declared as $declaration) {
            $this->checks->check($declaration->proposed->rule, false);
        }

        return array_map(fn (DeclaredProposal $declaration): ProposalReceipt => ProposalReceipt::of(
            RuleProposal::open($projectKey, $actor, $declaration->requestId, $declaration->proposed, null),
            $declaration->proposed,
        ), $declared);
    }
}
