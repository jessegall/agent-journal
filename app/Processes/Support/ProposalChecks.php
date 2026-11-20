<?php

declare(strict_types=1);

namespace App\Processes\Support;

use App\Processes\Enums\ScopeType;
use App\Processes\Exceptions\RuleProposalRefused;
use App\Processes\Values\CommandRule;

/**
 * What every proposed rule must hold before it is stored: it is a project rule, and a command known as a test, check
 * or build keeps its contract, so a new label never skips its reader (story 180).
 */
final readonly class ProposalChecks
{
    public function __construct(private CommandRuleRegistry $rules) {}

    /**
     * @param  bool  $heldForReader  whether the request the rule answers already holds the command for its reader
     *
     * @throws RuleProposalRefused
     */
    public function check(CommandRule $rule, bool $heldForReader): void
    {
        if ($rule->scope->type !== ScopeType::Project) {
            throw RuleProposalRefused::outsideProject($rule->id);
        }

        if (! $rule->hasContract() && ($heldForReader || $this->rules->coversAsCheck($rule))) {
            throw RuleProposalRefused::checkRenamed($rule->operation());
        }
    }
}
