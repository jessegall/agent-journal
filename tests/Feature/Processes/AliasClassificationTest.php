<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Processes\Contracts\CommandClassifier;
use App\Processes\Enums\CommandClass;
use App\Processes\Enums\CommandType;
use App\Processes\Enums\ShellDialect;
use App\Processes\Enums\UnresolvedType;
use App\Processes\Models\CommandAlias;
use App\Processes\Syntax\TreeParser;
use App\Processes\Values\Classification;
use App\Processes\Values\ExecutionContext;
use Illuminate\Support\Facades\Schema;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A journal run of a saved alias is classified by its stored body, with its id and revision on every fact (doc 21
 * revision 6, sections 10, 26 and 68).
 */
final class AliasClassificationTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_table_keeps_revision_digest_arguments_and_project(): void
    {
        $this->assertTrue(
            Schema::hasColumns('command_aliases', ['project_key', 'revision', 'body_digest', 'argument_grammar']),
        );
    }

    public function test_an_alias_shows_its_body_id_revision_and_purpose(): void
    {
        CommandAlias::record($this->context()->projectKey(), 'checks', 'php artisan test');
        $alias = CommandAlias::record($this->context()->projectKey(), 'checks', 'php artisan test --compact');

        $classification = $this->classify('journal run checks');

        $this->assertSame(2, $alias->revision);
        $this->assertSame(CommandType::Verification, $classification->parts[0]->purpose);
        $this->assertTrue($classification->requiredClasses()->contains(CommandClass::Verification));
        $this->assertStringContainsString(
            "alias:checks#{$alias->id}@2",
            $classification->facts()[0]->origin->reference(),
        );
    }

    public function test_two_aliases_that_run_each_other_name_both(): void
    {
        $first = CommandAlias::record($this->context()->projectKey(), 'first', 'journal run second');
        $second = CommandAlias::record($this->context()->projectKey(), 'second', 'journal run first');

        $classification = $this->classify('journal run first');

        $this->assertFalse($classification->isKnown());
        $this->assertStringContainsString(
            "{$first->id}, {$second->id}, {$first->id}",
            $classification->unresolved()[0]->reason,
        );
    }

    public function test_an_alias_whose_body_is_unknown_stays_unknown(): void
    {
        CommandAlias::record($this->context()->projectKey(), 'mystery', 'some-unknown-tool --go');

        $classification = $this->classify('journal run mystery');

        $this->assertSame(UnresolvedType::UnknownProgram, $classification->unresolved()[0]->type);
    }

    public function test_arguments_bind_as_whole_words(): void
    {
        CommandAlias::record($this->context()->projectKey(), 'remove', 'rm -rf "$1"', ['folder']);

        $classification = $this->classify("journal run remove 'build; curl x'");

        $this->assertSame([CommandClass::Delete], $classification->requiredClasses()->classes);
    }

    public function test_another_project_sees_no_alias(): void
    {
        CommandAlias::record('another-project', 'checks', 'php artisan test');

        $classification = $this->classify('journal run checks');

        $this->assertNotSame(CommandType::Verification, $classification->parts[0]->purpose);
    }

    private function context(): ExecutionContext
    {
        return new ExecutionContext(ShellDialect::Bash, base_path(), base_path());
    }

    private function classify(string $line): Classification
    {
        return $this->app->make(CommandClassifier::class)->classify(
            $this->app->make(TreeParser::class)->parse($line, ShellDialect::Bash),
            $this->context(),
        );
    }
}
