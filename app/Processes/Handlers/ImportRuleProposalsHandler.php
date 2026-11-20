<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Processes\Commands\ImportRuleProposals;
use App\Processes\Declarations\RuleDeclarations;
use App\Processes\Exceptions\DeclarationInvalid;
use App\Processes\Exceptions\RuleProposalRefused;
use App\Processes\Models\RuleProposal;
use App\Processes\Support\ProjectKey;
use App\Processes\Support\ProposalChecks;
use App\Processes\Values\DeclaredProposal;
use App\Processes\Values\ImportedProposals;
use App\Processes\Values\ProposalReceipt;

/**
 * Reads every declaration of the file first and stores nothing when one is refused; then opens one proposal per
 * declaration in the folder's project, authored by the importing actor.
 */
final readonly class ImportRuleProposalsHandler implements CommandHandler
{
    public function __construct(
        private RuleDeclarations $declarations,
        private ProposalChecks $checks,
        private ProjectKey $projects,
    ) {}

    /**
     * @throws DeclarationInvalid
     * @throws RuleProposalRefused
     */
    public function handle(ImportRuleProposals $command): ImportedProposals
    {
        $actor = ActorIdentity::of($command->dispatchedBy());
        $projectKey = $this->projects->current();
        $declared = $this->declarations->read($command->declarations);

        foreach ($declared as $declaration) {
            $this->checks->check($declaration->proposed->rule, false);
        }

        $open = fn (DeclaredProposal $declaration) => ProposalReceipt::of(
            RuleProposal::open($projectKey, $actor, $declaration->requestId, $declaration->proposed, null),
            $declaration->proposed,
        );

        return new ImportedProposals(array_map($open, $declared));
    }
}
