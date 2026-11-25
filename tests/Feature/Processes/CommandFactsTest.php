<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Contracts\Admission\ShellAdmission;
use App\Contracts\Processes\ShellCommandParser as ShellCommandParserContract;
use App\Enums\CommandRules\CommandEffect;
use App\Enums\CommandRules\CommandType;
use App\Enums\CommandRules\ParseOutcome;
use App\Enums\Hooks\AnswerType;
use App\Enums\Processes\ShellDialect;
use App\Enums\Runs\PartJoin;
use App\Models\CommandRules\CommandAlias;
use App\Support\DomainRegistry;
use App\Support\ShellCommandParser;
use App\Values\CommandPart;
use App\Values\ExecutionContext;
use App\Values\ShellCommand;
use Illuminate\Support\Str;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

final class CommandFactsTest extends TestCase
{
    use RefreshHookDatabase;

    /**
     * Every installed domain, since the journal tools and routes this test names come from them.
     */
    protected static function bootedDomains(): array
    {
        return DomainRegistry::installedClasses(dirname(__DIR__, 3));
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->recordAlias(
            new ExecutionContext(ShellDialect::Bash, base_path(), base_path())->projectKey(),
            'tests',
            'php artisan test',
        );
    }

    /**
     * The answers Core's admission gives each role, read through the tree classifier: an alias run needs its approved
     * proven reader, an unknown program or a journal route this version does not have needs a reviewed rule first, and
     * a read-only helper never changes a file.
     *
     * @return iterable<string, array{string, AnswerType, AnswerType}>
     */
    public static function linesAndRoleAnswers(): iterable
    {
        yield 'a command alias' => ['journal run tests', AnswerType::Deny, AnswerType::Deny];

        yield 'a command alias by its name' => ['journal tests --tail 5', AnswerType::Deny, AnswerType::Deny];

        yield 'a journal route' => ['journal task assigned', AnswerType::Allow, AnswerType::Allow];

        yield 'a journal route this version does not have' => ['journal task list', AnswerType::Deny, AnswerType::Deny];

        yield 'an unknown journal name' => ['journal not-saved', AnswerType::Deny, AnswerType::Deny];

        yield 'an unknown command alias' => ['journal run not-saved', AnswerType::Deny, AnswerType::Deny];

        yield 'a plain read' => ['git status', AnswerType::Allow, AnswerType::Allow];

        yield 'a quoted search' => ['grep -rn "needs work" app', AnswerType::Allow, AnswerType::Allow];

        yield 'an unsaved test run' => ['composer test', AnswerType::Deny, AnswerType::Deny];

        yield 'a test run behind an assignment' => [
            'APP_ENV=testing vendor/bin/phpunit',
            AnswerType::Deny,
            AnswerType::Deny,
        ];

        yield 'a test run in a pipe' => ['php artisan test | tail -5', AnswerType::Deny, AnswerType::Deny];

        yield 'a build after a read' => ['ls && npm run build', AnswerType::Deny, AnswerType::Deny];

        yield 'a file removal' => ['rm -rf build', AnswerType::Allow, AnswerType::Deny];

        yield 'a write through a redirect' => ['echo done > notes.txt', AnswerType::Allow, AnswerType::Deny];

        yield 'a write through a redirect without spaces' => ['cat a.txt>b.txt', AnswerType::Allow, AnswerType::Deny];

        yield 'an unknown program' => ['some-tool --flag', AnswerType::Deny, AnswerType::Deny];

        yield 'a command substitution' => ['$(echo composer) test', AnswerType::Deny, AnswerType::Deny];

        yield 'a variable' => ['cat $FILE', AnswerType::Deny, AnswerType::Deny];

        yield 'a quote left open' => ['echo "unfinished', AnswerType::Deny, AnswerType::Deny];
    }

    #[DataProvider('linesAndRoleAnswers')]
    public function test_the_admission_decides_each_role_answer(
        string $line,
        AnswerType $mainAgent,
        AnswerType $readOnlyHelper,
    ): void {
        $this->assertSame($mainAgent, $this->answer('main-agent', $line));
        $this->assertSame($readOnlyHelper, $this->answer('read-only-helper', $line));
    }

    public function test_the_app_reads_shell_commands_with_the_processes_parser(): void
    {
        $this->assertInstanceOf(ShellCommandParser::class, $this->app->make(ShellCommandParserContract::class));
    }

    public function test_a_line_is_split_into_its_commands_and_joins(): void
    {
        $command = $this->parse('APP_ENV=testing composer test 2>&1 | tee log.txt; git status');

        $this->assertSame(ParseOutcome::Complete, $command->outcome);
        $this->assertSame(['composer', 'tee', 'git'], array_map(fn ($part) => $part->program, $command->parts));
        $this->assertSame(
            [PartJoin::Pipe, PartJoin::Sequence, PartJoin::End],
            array_map(fn ($part) => $part->join, $command->parts),
        );
        $this->assertSame(
            [CommandType::Unknown, CommandType::Ordinary, CommandType::Ordinary],
            array_map(fn ($part) => $part->type, $command->parts),
        );
        $this->assertSame(CommandEffect::ChangesFiles, $command->parts[1]->effect);
        $this->assertSame(['test'], $command->parts[0]->arguments);
    }

    public function test_quoted_operators_stay_inside_their_word(): void
    {
        $command = $this->parse("grep 'a | b && c' notes.txt");

        $this->assertCount(1, $command->parts);
        $this->assertSame(['a | b && c', 'notes.txt'], $command->parts[0]->arguments);
        $this->assertSame(CommandEffect::ReadsOnly, $command->parts[0]->effect);
    }

    public function test_a_comment_or_a_flag_does_not_make_a_check_saved(): void
    {
        foreach (['composer test --saved', 'SAVED=1 composer test', 'composer test # journal'] as $line) {
            $parts = $this->parse($line)->parts;
            $this->assertTrue(array_any($parts, fn (CommandPart $part): bool => $part->type->needsAlias()), $line);
        }
    }

    private function parse(string $line): ShellCommand
    {
        return $this->app->make(ShellCommandParserContract::class)->parse($line, ShellDialect::Bash);
    }

    private function answer(string $profileKey, string $line): AnswerType
    {
        config(['processes.runner' => true]);
        TestStart::start($profileKey)->startRequest($this->app);
        $context = ExecutionContext::inFolder(base_path());
        $admission = $this->app->make(ShellAdmission::class)->admit(
            $line,
            ShellDialect::Bash,
            $context,
            Str::ulid()->toString(),
        );

        return $admission->isAllowed() ? AnswerType::Allow : AnswerType::Deny;
    }

    /**
     * @param  list<string>  $arguments
     */
    private function recordAlias(string $projectKey, string $name, string $line, array $arguments = []): CommandAlias
    {
        $alias = CommandAlias::create($projectKey, $name);
        $alias->recordLine($line, $arguments);

        return $alias;
    }
}
