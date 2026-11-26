<?php

declare(strict_types=1);

namespace App\CommandRules\Commands\ImportRuleProposals;

use App\Bus\Contracts\CommandHandler;
use App\CommandRules\Declarations\RuleDeclarations;
use App\CommandRules\Exceptions\DeclarationInvalid;
use App\CommandRules\Exceptions\RuleProposalRefused;
use App\CommandRules\ProposalChecks;
use App\CommandRules\RuleProposals;
use App\CommandRules\Values\DeclaredProposal;
use App\CommandRules\Values\ImportedProposals;
use App\CommandRules\Values\ProposalReceipt;
use App\Projects\SelectedProject;

/**
 * Reads every declaration of the file first and stores nothing when one is refused; then opens one proposal per
 * declaration in the folder's project, authored by the importing actor.
 */
final readonly class ImportRuleProposalsHandler implements CommandHandler
{
    public function __construct(
        private RuleDeclarations $declarations,
        private ProposalChecks $checks,
        private SelectedProject $projects,
        private RuleProposals $proposals,
    ) {}

    /**
     * @throws DeclarationInvalid
     * @throws RuleProposalRefused
     */
    public function handle(ImportRuleProposalsCommand $command): ImportedProposals
    {
        $actor = $command->dispatchedBy();
        $project = $this->projects->find();
        $declared = $this->declarations->read($command->declarations);

        foreach ($declared as $declaration) {
            $this->checks->check($declaration->proposed->rule, false);
        }

        $open = fn (DeclaredProposal $declaration) => ProposalReceipt::of(
            $this->proposals->open($project, $actor, $declaration->requestId, $declaration->proposed, null),
            $declaration->proposed,
        );

        return new ImportedProposals(array_map($open, $declared));
    }
}
