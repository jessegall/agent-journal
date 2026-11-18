<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

use App\Processes\Exceptions\CommandRuleConflict;
use App\Processes\Values\Classification;
use App\Processes\Values\CommandRule;
use App\Processes\Values\ExecutionContext;
use App\Processes\Values\ShellTree;

/**
 * Classifies every executable part of a shell tree by the declared behaviour of its program (doc 21 revision 6,
 * section 55). It executes nothing; what it cannot place it reports as unresolved facts.
 */
interface CommandClassifier
{
    public function classify(ShellTree $tree, ExecutionContext $context): Classification;

    /**
     * The same classifier that also knows a proposed rule, as an owner-approved evidence sample is classified.
     *
     * @throws CommandRuleConflict when the proposed rule overlaps an active one
     */
    public function withCandidate(CommandRule $rule): self;
}
