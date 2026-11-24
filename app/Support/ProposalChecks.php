<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\ScopeType;
use App\Exceptions\RuleProposalRefused;
use App\Values\CommandRule;

/**
 * What every proposed rule must hold before it is stored: it is a project rule, and a command known as a test, check
 * or build keeps its contract, so a new label never skips its reader (story 180).
 */
final readonly class ProposalChecks
{
    public function __construct(private CommandRuleRegistry $rules) {}

    /**
     * @param  bool  $isHeldForReader  whether the request the rule answers already holds the command for its reader
     *
     * @throws RuleProposalRefused
     */
    public function check(CommandRule $rule, bool $isHeldForReader): void
    {
        if ($rule->scope->type !== ScopeType::Project) {
            throw RuleProposalRefused::outsideProject($rule->id);
        }

        if (! $rule->hasContract() && ($isHeldForReader || $this->rules->coversAsCheck($rule))) {
            throw RuleProposalRefused::checkRenamed($rule->operation());
        }
    }
}
