<?php

declare(strict_types=1);

namespace App\Commands\RestoreCommandRule;

use App\Contracts\Bus\CommandHandler;
use App\Exceptions\ClassificationRuleRefused;
use App\Exceptions\RuleProposalRefused;
use App\Models\ClassificationRule;
use App\Models\RuleProposalRevision;
use App\Models\RuleRevision;
use App\Support\ActorIdentity;
use App\Support\ProjectKey;
use App\Support\RuleProposals;
use App\Values\ProposalReceipt;
use App\Values\ProposedRule;

/**
 * Proposes the declaration an earlier approved revision was approved from, with its examples, so the owner reviews and
 * approves it again; nothing becomes active here.
 */
final readonly class RestoreCommandRuleHandler implements CommandHandler
{
    public function __construct(
        private ProjectKey $projects,
        private RuleProposals $proposals,
    ) {}

    /**
     * @throws ClassificationRuleRefused
     * @throws RuleProposalRefused
     */
    public function handle(RestoreCommandRuleCommand $command): ProposalReceipt
    {
        $rule = ClassificationRule::query()
            ->ofProject($this->projects->current())
            ->whereKey($command->classificationRuleId)
            ->lockForUpdate()
            ->sole();

        if ($rule->active_revision !== $command->expectedRevision) {
            throw ClassificationRuleRefused::stale($rule->rule_id, $command->expectedRevision, $rule->active_revision);
        }

        $earlier = RuleRevision::query()
            ->ofProject($rule->project_key)
            ->ofRule($rule->scope, $rule->rule_id)
            ->where('revision', $command->fromRevision)
            ->sole();

        $declaration = RuleProposalRevision::query()->whereKey($earlier->rule_proposal_revision_id)->sole();
        $evidence = "Restore of approved revision {$earlier->revision}: {$declaration->evidence}";
        $proposed = new ProposedRule($declaration->payload, $evidence, $declaration->examples);
        $owner = ActorIdentity::of($command->dispatchedBy());

        return ProposalReceipt::of(
            $this->proposals->open($rule->project_key, $owner, $command->requestId, $proposed, null),
            $proposed,
        );
    }
}
