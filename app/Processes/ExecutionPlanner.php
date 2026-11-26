<?php

declare(strict_types=1);

namespace App\Processes;

use App\CommandRules\Enums\ParseOutcome;
use App\Exceptions\ExecutionPlanRefused;
use App\Support\Syntax\TreeParser;
use App\Values\Classification;
use App\Values\ExecutionPlan;
use App\Values\ShellTree;

/**
 * Lowers a completely read and fully known command line into its execution plan.
 */
final readonly class ExecutionPlanner
{
    public function __construct(private TreeParser $syntax) {}

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
