<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Contracts\Bus\CommandClassifier;
use App\Enums\Agents\AccessType;
use App\Enums\Processes\ShellDialect;
use App\Support\DomainRegistry;
use App\Support\ShellOperations;
use App\Support\Syntax\TreeParser;
use App\Values\ExecutionContext;
use App\Values\Operation;
use App\Values\ResourceRequest;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The parser's classification gives every segment of a shell line an operation an access policy can decide: the
 * access it needs, the resources it touches and the rule that named it; anything it cannot place is unknown.
 */
final class OperationFactsTest extends TestCase
{
    use RefreshHookDatabase;

    /**
     * Every installed domain, since the journal tools and routes this test names come from them.
     */
    protected static function bootedDomains(): array
    {
        return DomainRegistry::installedClasses(dirname(__DIR__, 3));
    }

    public function test_deleting_a_branch_needs_delete(): void
    {
        [$operation] = $this->operations('git branch -D main');

        $this->assertContains(AccessType::Delete, $operation->accessTypes);
        $this->assertStringStartsWith('shell:', $operation->name);
        $this->assertNotSame(ShellOperations::UNKNOWN, $operation->name);
    }

    public function test_cat_reads_its_operand_and_the_redirect_creates_or_edits_its_target(): void
    {
        [$cat, $redirect] = $this->operations('cat a > b');

        $this->assertSame([AccessType::Execute, AccessType::Read], $cat->accessTypes);
        $this->assertSame(['a'], $this->targets($cat));
        $this->assertSame([AccessType::Create, AccessType::Edit], $redirect->accessTypes);
        $this->assertSame(['b'], $this->targets($redirect));
    }

    public function test_a_pipeline_gives_one_operation_per_segment(): void
    {
        $this->assertCount(2, $this->operations('git log | head'));
    }

    public function test_a_dynamic_bash_c_eval_and_command_substitution_are_unknown(): void
    {
        foreach (['bash -c "$SCRIPT"', 'eval "$LINE"', 'echo $(whoami)'] as $line) {
            $unknown = array_values(
                array_filter(
                    $this->operations($line),
                    fn (Operation $operation): bool => $operation->name === ShellOperations::UNKNOWN,
                ),
            );

            $this->assertNotSame([], $unknown, $line);
            $this->assertSame([], $unknown[0]->accessTypes);
        }
    }

    public function test_a_literal_bash_c_is_read_as_the_command_it_runs(): void
    {
        $operations = $this->operations('bash -c "rm -rf x"');

        $this->assertContains(AccessType::Delete, $operations[0]->accessTypes);
    }

    public function test_a_journal_call_is_named_by_its_journal_route(): void
    {
        [$operation] = $this->operations('journal task assigned');

        $this->assertStringStartsWith('shell:core.journal.', $operation->name);
    }

    /**
     * @return list<Operation>
     */
    private function operations(string $line): array
    {
        $tree = $this->app->make(TreeParser::class)->parse($line, ShellDialect::Bash);
        $classification = $this->app->make(CommandClassifier::class)->classify(
            $tree,
            new ExecutionContext(ShellDialect::Bash, base_path(), base_path()),
        );

        return $this->app->make(ShellOperations::class)->of($classification);
    }

    /**
     * @return list<string>
     */
    private function targets(Operation $operation): array
    {
        return array_map(fn (ResourceRequest $resource): string => $resource->target, $operation->resources);
    }
}
