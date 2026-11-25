<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Contracts\Bus\CommandClassifier;
use App\Enums\CommandRules\StepType;
use App\Enums\Processes\ShellDialect;
use App\Exceptions\ExecutionPlanRefused;
use App\Support\ExecutionPlanner;
use App\Support\Syntax\TreeParser;
use App\Values\ExecutionContext;
use App\Values\ExecutionPlan;
use App\Values\PlanWord;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A known, completely read command line is lowered into steps with literal arguments, never shell text.
 */
final class ExecutionPlanTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_cd_is_a_builtin_whose_context_reaches_the_next_command(): void
    {
        $root = $this->plan('cd project && pwd')->root;

        $this->assertSame(StepType::AndList, $root->type);
        [$cd, $pwd] = $root->children;
        $this->assertSame(StepType::Builtin, $cd->type);
        $this->assertSame(StepType::Builtin, $pwd->type);
        $this->assertSame($cd->context, $pwd->context);
    }

    public function test_sh_c_lowers_into_a_child_shell_with_its_parameters(): void
    {
        $shell = $this->plan("sh -c 'echo a; echo b' x y")->root;

        $this->assertSame(StepType::Shell, $shell->type);
        $this->assertSame('x', $shell->zero);
        $this->assertSame(['y'], $shell->positional);
        $this->assertSame(StepType::Sequence, $shell->children[0]->type);
        $this->assertCount(2, $shell->children[0]->children);
    }

    public function test_a_line_with_an_unknown_part_cannot_become_a_plan(): void
    {
        $this->expectException(ExecutionPlanRefused::class);

        $this->plan('python3 tool.py');
    }

    public function test_arguments_stay_words_and_a_substitution_runs_before_its_consumer(): void
    {
        $echo = $this->plan('echo "a b" c $(git rev-parse HEAD)')->root;

        $this->assertSame(
            [['echo'], ['a b'], ['c']],
            array_map(fn (PlanWord $word) => $word->pieces, array_slice($echo->argv, 0, 3)),
        );
        $this->assertSame(StepType::Substitution, $echo->children[0]->type);
        $this->assertSame([$echo->children[0]->node], $echo->argv[3]->pieces);
        $this->assertNotSame($echo->context, $echo->children[0]->context);
    }

    private function plan(string $line): ExecutionPlan
    {
        $tree = $this->app->make(TreeParser::class)->parse($line, ShellDialect::Bash);
        $classification = $this->app->make(CommandClassifier::class)->classify(
            $tree,
            new ExecutionContext(ShellDialect::Bash, '/work', '/work'),
        );

        return $this->app->make(ExecutionPlanner::class)->plan($tree, $classification);
    }
}
