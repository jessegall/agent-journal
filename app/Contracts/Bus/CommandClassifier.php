<?php

declare(strict_types=1);

namespace App\Contracts\Bus;

use App\Exceptions\CommandRuleConflict;
use App\Values\Classification;
use App\Values\CommandRule;
use App\Values\ExecutionContext;
use App\Values\ShellTree;

/**
 * Classifies every executable part of a shell tree by the declared behaviour of its program. It executes nothing; what it cannot place it reports as unresolved facts.
 */
interface CommandClassifier
{
    /**
     * What the parsed shell line does in the context: which programs it runs and what they may change.
     */
    public function classify(ShellTree $tree, ExecutionContext $context): Classification;

    /**
     * The same classifier that also knows a proposed rule, as an owner-approved evidence sample is classified.
     *
     * @throws CommandRuleConflict when the proposed rule overlaps an active one
     */
    public function withCandidate(CommandRule $rule): self;
}
