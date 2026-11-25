<?php

declare(strict_types=1);

namespace App\Commands\CommandRules\ImportRuleProposals;

use App\Contracts\Bus\CommandHandler;
use App\Declarations\RuleDeclarations;
use App\Exceptions\DeclarationInvalid;
use App\Exceptions\RuleProposalRefused;
use App\Support\ProposalChecks;
use App\Support\RuleProposals;
use App\Support\ServedEnvironment;
use App\Values\DeclaredProposal;
use App\Values\ImportedProposals;
use App\Values\ProposalReceipt;

/**
 * Reads every declaration of the file first and stores nothing when one is refused; then opens one proposal per
 * declaration in the folder's project, authored by the importing actor.
 */
final readonly class ImportRuleProposalsHandler implements CommandHandler
{
    public function __construct(
        private RuleDeclarations $declarations,
        private ProposalChecks $checks,
        private ServedEnvironment $projects,
        private RuleProposals $proposals,
    ) {}

    /**
     * @throws DeclarationInvalid
     * @throws RuleProposalRefused
     */
    public function handle(ImportRuleProposalsCommand $command): ImportedProposals
    {
        $actor = $command->dispatchedBy();
        $projectKey = $this->projects->current();
        $declared = $this->declarations->read($command->declarations);

        foreach ($declared as $declaration) {
            $this->checks->check($declaration->proposed->rule, false);
        }

        $open = fn (DeclaredProposal $declaration) => ProposalReceipt::of(
            $this->proposals->open($projectKey, $actor, $declaration->requestId, $declaration->proposed, null),
            $declaration->proposed,
        );

        return new ImportedProposals(array_map($open, $declared));
    }
}
