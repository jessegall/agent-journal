<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

use App\Processes\Values\Classification;
use App\Processes\Values\ExecutionContext;
use App\Processes\Values\ShellTree;

/**
 * Classifies every executable part of a shell tree by the declared behaviour of its program (doc 21 revision 6,
 * section 55). It executes nothing; what it cannot place it reports as unresolved facts.
 */
interface CommandClassifier
{
    public function classify(ShellTree $tree, ExecutionContext $context): Classification;
}
