<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Processes\Contracts\CommandClassifier;
use App\Processes\Contracts\ShellSyntax;
use App\Processes\Data\ExplainedNodeData;
use App\Processes\Enums\CommandClass;
use App\Processes\Enums\CommandType;
use App\Processes\Enums\OutputRequirement;
use App\Processes\Enums\ShellDialect;
use App\Processes\Enums\UnresolvedType;
use App\Processes\Support\Explanations;
use App\Processes\Values\Classification;
use App\Processes\Values\ExecutionContext;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Core's built-in rules classify the common command families as doc 21 revision 6, sections 6 and 68 declare.
 */
final class BuiltInRulesTest extends TestCase
{
    use RefreshHookDatabase;

    /**
     * @return iterable<string, array{string, list<CommandClass>}>
     */
    public static function familyClasses(): iterable
    {
        yield 'rg reads' => ['rg -n pattern src', [CommandClass::Read]];
        yield 'ls -la reads' => ['ls -la', [CommandClass::Read]];
        yield 'head -20 reads' => ['head -20 notes.txt', [CommandClass::Read]];
        yield 'sed -i edits' => ["sed -i 's/a/b/' file.txt", [CommandClass::Read, CommandClass::Edit]];
        yield 'sed prints' => ["sed -n '1,5p' file.txt", [CommandClass::Read]];
        yield 'rm -f deletes' => ['rm -f old.log', [CommandClass::Delete]];
        yield 'mv moves' => ['mv a b', [CommandClass::Read, CommandClass::Write, CommandClass::Delete]];
        yield 'curl saving' => ['curl -o f https://example.com', [CommandClass::Write, CommandClass::Network]];
        yield 'curl fetching' => ['curl -fsSL https://example.com', [CommandClass::Network]];
        yield 'kill' => ['kill -9 123', [CommandClass::ProcessControl]];
        yield 'npm install' => [
            'npm install',
            [
                CommandClass::Read,
                CommandClass::Write,
                CommandClass::Delete,
                CommandClass::Network,
                CommandClass::PackageInstall,
            ],
        ];
        yield 'pint fixes' => ['vendor/bin/pint', [CommandClass::Read, CommandClass::Edit, CommandClass::Verification]];
        yield 'vite build' => ['vite build', [CommandClass::Read, CommandClass::Write, CommandClass::Build]];
        yield 'npx waits for task 770' => ['npx vite build', []];
        yield 'git status --short' => ['git status --short', [CommandClass::Read, CommandClass::VersionControl]];
        yield 'git -C dir log' => [
            'git -C sub --no-pager log --oneline -5',
            [CommandClass::Read, CommandClass::VersionControl],
        ];
        yield 'git branch --list' => ['git branch --list', [CommandClass::Read, CommandClass::VersionControl]];
        yield 'git branch topic' => [
            'git branch topic',
            [CommandClass::Read, CommandClass::Write, CommandClass::VersionControl],
        ];
        yield 'git branch -D topic' => [
            'git branch -D topic',
            [CommandClass::Read, CommandClass::Delete, CommandClass::VersionControl],
        ];
        yield 'git diff --ext-diff' => ['git diff --ext-diff', []];
        yield 'git -c is unresolved' => ['git -c core.pager=less log', []];
        yield 'git fetch' => [
            'git fetch --all --prune',
            [CommandClass::Read, CommandClass::Write, CommandClass::Network, CommandClass::VersionControl],
        ];
        yield 'git push --force' => [
            'git push --force origin main',
            [CommandClass::Read, CommandClass::Write, CommandClass::Network, CommandClass::VersionControl],
        ];
        yield 'git push --delete' => [
            'git push --delete origin old',
            [
                CommandClass::Read,
                CommandClass::Write,
                CommandClass::Delete,
                CommandClass::Network,
                CommandClass::VersionControl,
            ],
        ];
        yield 'git ls-remote' => [
            'git ls-remote origin',
            [CommandClass::Read, CommandClass::Network, CommandClass::VersionControl],
        ];
        yield 'git reset --hard' => [
            'git reset --hard HEAD~1',
            [
                CommandClass::Read,
                CommandClass::Write,
                CommandClass::Edit,
                CommandClass::Delete,
                CommandClass::VersionControl,
            ],
        ];
    }

    /**
     * @param  list<CommandClass>  $classes
     */
    #[DataProvider('familyClasses')]
    public function test_each_family_needs_its_declared_classes(string $line, array $classes): void
    {
        $classification = $this->classify($line);

        if ($classes === []) {
            $this->assertFalse($classification->isKnown(), $line);

            return;
        }
        $this->assertTrue($classification->isKnown(), $line);
        $this->assertSame($classes, $classification->requiredClasses()->classes, $line);
    }

    /**
     * @return iterable<string, array{string}>
     */
    public static function checks(): iterable
    {
        yield 'artisan test' => ['php artisan test --compact --filter Foo'];
        yield 'phpstan' => ['vendor/bin/phpstan analyse --memory-limit=1G'];
        yield 'pint check' => ['vendor/bin/pint --test'];
        yield 'the judge' => ['.journal/plugins/code-commandments/bin/commandments-release judge --changes'];
        yield 'vue-tsc' => ['vue-tsc --noEmit'];
        yield 'php8.3 spelling' => ['php8.3 artisan test'];
    }

    #[DataProvider('checks')]
    public function test_checks_are_tests_and_checks_with_their_whole_output(string $line): void
    {
        $classification = $this->classify($line);
        $parts = $classification->parts;

        $this->assertTrue($classification->requiredClasses()->contains(CommandClass::Verification), $line);
        $this->assertSame(CommandType::Verification, $parts[0]->purpose, $line);
        $this->assertSame(OutputRequirement::Full, $parts[0]->outputRequirement(), $line);
    }

    public function test_explain_shows_a_check_as_tests_and_checks_with_its_contract_and_reader_state(): void
    {
        $explanation = $this->app->make(Explanations::class)->explain(
            'vendor/bin/phpstan analyse --no-progress',
            ShellDialect::Bash,
        );
        $part = array_values(
            array_filter($explanation->nodes, fn (ExplainedNodeData $node): bool => $node->purpose !== ''),
        )[0];

        $this->assertSame('Tests and checks', $part->purpose);
        $this->assertContains('tool phpstan', $part->contract);
        $this->assertContains('reader required', $part->contract);
    }

    public function test_an_unknown_option_on_a_check_never_runs_it_as_ordinary(): void
    {
        $unknown = $this->classify('vendor/bin/phpstan analyse --frobnicate')->unresolved()[0];

        $this->assertSame(UnresolvedType::UnknownOption, $unknown->type);
    }

    public function test_bare_interpreters_and_editors_are_never_read_defaults(): void
    {
        foreach (['php script.php', 'python run.py', 'node index.js', 'less file.txt', 'vim file.txt'] as $line) {
            $this->assertFalse($this->classify($line)->isKnown(), $line);
        }
    }

    private function classify(string $line): Classification
    {
        $tree = $this->app->make(ShellSyntax::class)->parse($line, ShellDialect::Bash);

        return $this->app->make(CommandClassifier::class)->classify(
            $tree,
            new ExecutionContext(ShellDialect::Bash, base_path(), base_path()),
        );
    }
}
