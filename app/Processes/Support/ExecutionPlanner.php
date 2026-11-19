<?php

declare(strict_types=1);

namespace App\Processes\Support;

use App\Processes\Contracts\ShellSyntax;
use App\Processes\Enums\ParseOutcome;
use App\Processes\Exceptions\ExecutionPlanRefused;
use App\Processes\Values\Classification;
use App\Processes\Values\ExecutionPlan;
use App\Processes\Values\ShellTree;

/**
 * Lowers a completely read and fully known command line into its execution plan (doc 21 revision 6, section 53).
 */
final readonly class ExecutionPlanner
{
    public function __construct(private ShellSyntax $syntax) {}

    /**
     * @throws ExecutionPlanRefused
     */
    public function plan(ShellTree $tree, Classification $classification): ExecutionPlan
    {
        if ($tree->outcome !== ParseOutcome::Complete) {
            throw ExecutionPlanRefused::incomplete();
        }
        if (! $classification->isKnown()) {
            throw ExecutionPlanRefused::unknown();
        }

        return new ExecutionPlan(
            new PlanBuilder($tree, $this->syntax, [])->root(),
            hash('sha256', $tree->dialect->value."\0".$tree->source),
        );
    }
}
