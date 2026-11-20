<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Processes\Commands\RestoreCommandRule;
use App\Processes\Exceptions\ClassificationRuleRefused;
use App\Processes\Exceptions\RuleProposalRefused;
use App\Processes\Models\ClassificationRule;
use App\Processes\Models\RuleProposal;
use App\Processes\Models\RuleProposalRevision;
use App\Processes\Models\RuleRevision;
use App\Processes\Support\ProjectKey;
use App\Processes\Values\ProposalReceipt;
use App\Processes\Values\ProposedRule;

/**
 * Proposes the declaration an earlier approved revision was approved from, with its examples, so the owner reviews and
 * approves it again; nothing becomes active here.
 */
final readonly class RestoreCommandRuleHandler implements CommandHandler
{
    public function __construct(
        private ProjectKey $projects,
    ) {}

    /**
     * @throws ClassificationRuleRefused
     * @throws RuleProposalRefused
     */
    public function handle(RestoreCommandRule $command): ProposalReceipt
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
            RuleProposal::open($rule->project_key, $owner, $command->requestId, $proposed, null),
            $proposed,
        );
    }
}
