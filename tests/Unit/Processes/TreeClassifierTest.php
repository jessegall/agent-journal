<?php

declare(strict_types=1);

namespace Tests\Unit\Processes;

use App\Pipelines\Contracts\RunsPipelines;
use App\Pipelines\Support\Pipelines;
use App\Processes\Classification\RedirectFacts;
use App\Processes\Classification\TreeClassifier;
use App\Processes\Enums\CommandClass;
use App\Processes\Enums\OperandType;
use App\Processes\Enums\ShellDialect;
use App\Processes\Enums\UnresolvedType;
use App\Processes\Rules\WrapperRules;
use App\Processes\Support\CommandRuleRegistry;
use App\Processes\Support\PackageScripts;
use App\Processes\Support\ProgramClassifiers;
use App\Processes\Support\ProgramNames;
use App\Processes\Syntax\TreeParser;
use App\Processes\Values\ArgumentGrammar;
use App\Processes\Values\Classification;
use App\Processes\Values\CommandClassSet;
use App\Processes\Values\CommandRule;
use App\Processes\Values\ExecutionContext;
use App\Processes\Values\ProgramSpellings;
use App\Processes\Values\UnresolvedFact;
use Illuminate\Container\Container;
use Illuminate\Contracts\Container\Container as ContainerContract;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Processes\NoAliases;

/**
 * The tree classifier gives every part its declared classes, every redirect and background job its own fact, and
 * reports what it cannot place (doc 21 revision 3, section 30, the representative analysis results).
 */
final class TreeClassifierTest extends TestCase
{
    public function test_a_plain_read_needs_read_only(): void
    {
        $classification = $this->classify('cat a');

        $this->assertSame([CommandClass::Read], $classification->requiredClasses()->classes);
        $this->assertTrue($classification->isKnown());
    }

    public function test_a_redirect_adds_its_write_on_the_command_that_holds_it(): void
    {
        $classification = $this->classify('cat a > b');
        $cat = $classification->tree->executableParts()[0];

        $this->assertSame([CommandClass::Read, CommandClass::Write], $classification->requiredClasses()->classes);
        $this->assertSame($cat->id, $classification->factsFor(CommandClass::Write)[0]->node);
        $this->assertSame([CommandClass::Write], $this->classify('> out.log')->requiredClasses()->classes);
        $this->assertSame([CommandClass::Read], $this->classify('cat a > /dev/null 2>&1')->requiredClasses()->classes);
    }

    public function test_a_chain_and_a_substitution_need_every_childs_classes(): void
    {
        $this->assertSame(
            [CommandClass::Read, CommandClass::Delete],
            $this->classify('cat a && rm a')->requiredClasses()->classes,
        );

        $substituted = $this->classify('echo "$(rm a)"');
        $this->assertTrue($substituted->requiredClasses()->contains(CommandClass::Delete));
    }

    public function test_a_quoted_here_document_runs_nothing_and_an_unquoted_one_runs_its_substitution(): void
    {
        $quoted = $this->classify("cat <<'EOF'\n\$(rm a)\nEOF");
        $unquoted = $this->classify("cat <<EOF\n\$(rm a)\nEOF");

        $this->assertFalse($quoted->requiredClasses()->contains(CommandClass::Delete));
        $this->assertTrue($unquoted->requiredClasses()->contains(CommandClass::Delete));
    }

    public function test_an_undeclared_program_is_unknown_and_names_itself(): void
    {
        $classification = $this->classify('acme verify');
        $unknown = $classification->unresolved()[0];

        $this->assertFalse($classification->isKnown());
        $this->assertSame(UnresolvedType::UnknownProgram, $unknown->type);
        $this->assertStringContainsString('acme', $unknown->reason);
    }

    public function test_background_jobs_path_changes_shells_and_unreadable_lines(): void
    {
        $this->assertTrue($this->classify('cat a &')->requiredClasses()->contains(CommandClass::ProcessControl));
        $this->assertSame(UnresolvedType::UnresolvedExecutable, $this->firstUnresolved('PATH=/tmp cat a')->type);
        $this->assertTrue($this->classify('LANG=C cat a')->isKnown());
        $this->assertSame(UnresolvedType::InterpretedSource, $this->firstUnresolved("sh <<'TEXT'\nrm a\nTEXT")->type);
        $this->assertSame(UnresolvedType::UnsupportedSyntax, $this->firstUnresolved('cat "open')->type);
        $this->assertSame(
            UnresolvedType::UnsupportedSyntax,
            $this->firstUnresolved('for f in a; do rm $f; done')->type,
        );
        $this->assertSame(UnresolvedType::DynamicWord, $this->firstUnresolved('cat a > $OUT')->type);
        $this->assertTrue(
            $this->classify('cat a > /dev/tcp/example.com/80')->requiredClasses()->contains(CommandClass::Network),
        );
    }

    public function test_wrappers_expose_their_child_and_keep_their_own_classes(): void
    {
        $this->assertSame([CommandClass::Read], $this->classify('env -- cat a')->requiredClasses()->classes);
        $this->assertSame(
            [CommandClass::Read, CommandClass::PrivilegeChange],
            $this->classify('sudo cat a')->requiredClasses()->classes,
        );
        $this->assertSame(
            [CommandClass::Read, CommandClass::ProcessControl],
            $this->classify('timeout 10 cat a')->requiredClasses()->classes,
        );
        $this->assertSame(
            [CommandClass::Read, CommandClass::Delete],
            $this->classify('find . -exec rm -- {} +')->requiredClasses()->classes,
        );
        $this->assertSame([CommandClass::Delete], $this->classify('xargs -0 rm --')->requiredClasses()->classes);
        $this->assertSame(UnresolvedType::UnknownWrapperOption, $this->firstUnresolved('env --frobnicate cat a')->type);
        $this->assertSame(UnresolvedType::UnresolvedExecutable, $this->firstUnresolved('env PATH=/tmp cat a')->type);
        $this->assertSame(UnresolvedType::InterpretedSource, $this->firstUnresolved("xargs sh -c 'rm \$1'")->type);
        $this->assertSame(UnresolvedType::InterpretedSource, $this->firstUnresolved('source ./setup.sh')->type);
    }

    public function test_a_literal_shell_source_is_read_and_classified_like_the_line(): void
    {
        $classification = $this->classify("sh -c 'cat a; rm a'");

        $this->assertSame([CommandClass::Read, CommandClass::Delete], $classification->requiredClasses()->classes);
        $this->assertTrue($classification->isKnown());
        $this->assertSame(UnresolvedType::UnknownProgram, $this->firstUnresolved("bash -c 'acme verify'")->type);
        $this->assertSame(UnresolvedType::DynamicWord, $this->firstUnresolved('bash -c "$SCRIPT"')->type);
    }

    private function firstUnresolved(string $line): UnresolvedFact
    {
        return $this->classify($line)->unresolved()[0];
    }

    private function classify(string $line): Classification
    {
        $container = new Container();
        $container->bind(RunsPipelines::class, Pipelines::class);
        $container->instance(ContainerContract::class, $container);
        $parser = $container->make(TreeParser::class);
        $tree = $parser->parse($line, ShellDialect::Bash);
        $rules = CommandRuleRegistry::from([
            CommandRule::forProgram(
                'core.cat',
                new ProgramSpellings('cat'),
                [],
                ArgumentGrammar::operands(OperandType::Path)->repeating(),
                CommandClassSet::of(CommandClass::Read),
            ),
            CommandRule::forProgram(
                'core.rm',
                new ProgramSpellings('rm'),
                [],
                ArgumentGrammar::operands(OperandType::Path)->repeating()->endingOptionsAtDoubleDash(),
                CommandClassSet::of(CommandClass::Delete),
            ),
            CommandRule::forProgram(
                'core.echo',
                new ProgramSpellings('echo'),
                [],
                ArgumentGrammar::operands(OperandType::Text)->repeating(),
                CommandClassSet::empty(),
            ),
        ]);

        return new TreeClassifier(
            $rules,
            new ProgramNames(),
            new RedirectFacts(),
            new WrapperRules(),
            $parser,
            new ProgramClassifiers(),
            new PackageScripts(),
            new NoAliases(),
        )->classify($tree, new ExecutionContext(ShellDialect::Bash, '/work', '/work'));
    }
}
