<?php

declare(strict_types=1);

namespace App\Processes\Support;

use App\Processes\Contracts\CommandRuleResolver;
use App\Processes\Exceptions\ClassificationUnavailable;
use App\Processes\Exceptions\CommandRuleConflict;
use App\Processes\Models\ModuleRuleBundle;
use App\Processes\Models\RuleRevision;
use App\Processes\Values\CommandRule;
use App\Processes\Values\RuleBundle;
use App\Processes\Values\RuleReference;

/**
 * The rules one request classifies with (doc 21 revision 6, section 9): Core's built-ins, the module bundles the
 * project owner activated at their exact digest, and the project's active approved rules, exact replacements included.
 * It is bound per request and read from the store each time, never shared between projects.
 */
final readonly class ActiveRules
{
    public function __construct(private CommandRuleRegistry $startup, private CommandRuleResolver $project) {}

    /**
     * @throws ClassificationUnavailable
     */
    public function registry(): CommandRuleRegistry
    {
        $approvals = $this->project->approvedBundles();
        $approved = array_values(array_filter(
            $this->startup->bundles(),
            fn (RuleBundle $bundle): bool => array_any(
                $approvals,
                fn (ModuleRuleBundle $row): bool => $row->approves($bundle),
            ),
        ));
        try {
            return $this->startup->withApprovedBundles(...$approved)->withRules(...$this->projectRules());
        } catch (CommandRuleConflict $conflict) {
            throw ClassificationUnavailable::conflicting($conflict);
        }
    }

    /**
     * The approved revision active for an operation, with the reader and proof a check was approved with, or none.
     *
     * @return list<RuleRevision>
     *
     * @throws ClassificationUnavailable
     */
    public function approvedFor(string $operation): array
    {
        return array_values(array_filter(
            $this->project->activeRevisions(),
            fn (RuleRevision $revision): bool => $revision->payload->operation() === $operation,
        ));
    }

    /**
     * The rule revisions the project's rules replace but no owner declares any more, as after a module was removed.
     *
     * @return list<RuleReference>
     *
     * @throws ClassificationUnavailable
     */
    public function missingReplacements(): array
    {
        $known = $this->startup->declaredRules();
        $missing = [];
        foreach ($this->projectRules() as $rule) {
            foreach ($rule->replaces as $replaced) {
                if (! array_any($known, fn (CommandRule $other): bool => $replaced->names($other))) {
                    $missing[] = $replaced;
                }
            }
        }

        return $missing;
    }

    /**
     * @return list<CommandRule>
     *
     * @throws ClassificationUnavailable
     */
    private function projectRules(): array
    {
        $revisions = $this->project->activeRevisions();

        return array_map(fn (RuleRevision $revision): CommandRule => $revision->payload, $revisions);
    }
}
