<?php

declare(strict_types=1);

namespace App\CommandRules\Commands\RestoreCommandRule;

use App\Bus\Contracts\CommandHandler;
use App\CommandRules\Exceptions\ClassificationRuleRefused;
use App\CommandRules\Exceptions\RuleProposalRefused;
use App\CommandRules\RuleProposals;
use App\CommandRules\Values\ProposalReceipt;
use App\CommandRules\Values\ProposedRule;
use App\Models\CommandRules\ClassificationRule;
use App\Models\CommandRules\RuleProposalRevision;
use App\Models\CommandRules\RuleRevision;

/**
 * Proposes the declaration an earlier approved revision was approved from, with its examples, so the owner reviews and
 * approves it again; nothing becomes active here.
 */
final readonly class RestoreCommandRuleHandler implements CommandHandler
{
    public function __construct(private RuleProposals $proposals) {}

    /**
     * @throws ClassificationRuleRefused
     * @throws RuleProposalRefused
     */
    public function handle(RestoreCommandRuleCommand $command): ProposalReceipt
    {
        $rule = ClassificationRule::query()
            ->with('project')
            ->whereKey($command->classificationRuleId)
            ->lockForUpdate()
            ->sole();

        if ($rule->active_revision !== $command->expectedRevision) {
            throw ClassificationRuleRefused::stale($rule->rule_id, $command->expectedRevision, $rule->active_revision);
        }

        $earlier = RuleRevision::query()
            ->inProject($rule->project_id)
            ->ofRule($rule->scope, $rule->rule_id)
            ->withRevision($command->fromRevision)
            ->sole();

        $declaration = RuleProposalRevision::query()->whereKey($earlier->rule_proposal_revision_id)->sole();
        $evidence = "Restore of approved revision {$earlier->revision}: {$declaration->evidence}";
        $proposed = new ProposedRule($declaration->payload, $evidence, $declaration->examples->items());
        $owner = $command->dispatchedBy();

        return ProposalReceipt::of(
            $this->proposals->open($rule->project, $owner, $command->requestId, $proposed, null),
            $proposed,
        );
    }
}
