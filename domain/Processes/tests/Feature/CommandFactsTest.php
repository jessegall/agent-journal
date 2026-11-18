<?php

declare(strict_types=1);

namespace Domain\Processes\Tests\Feature;

use App\Hooks\Contracts\ShellCommandParser;
use App\Hooks\Enums\AnswerType;
use App\Hooks\Enums\CommandEffect;
use App\Hooks\Enums\CommandType;
use App\Hooks\Enums\ParseOutcome;
use App\Hooks\Enums\PartJoin;
use App\Hooks\Enums\ShellDialect;
use App\Hooks\Exceptions\ShellParserMissing;
use App\Hooks\Inputs\HookIdentity;
use App\Hooks\Inputs\MissingShellParser;
use App\Hooks\Inputs\ShellCommand;
use App\Hooks\Inputs\ShellCommandRequested;
use App\Hooks\States\MainAgentReadyState;
use App\Hooks\States\ReadOnlyHelperReadyState;
use App\Hooks\States\ReadyState;
use Domain\Processes\Models\CommandAlias;
use Domain\Processes\Support\ShellParser;
use Domain\Processes\Tests\TestCase;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Support\RefreshHookDatabase;

final class CommandFactsTest extends TestCase
{
    use RefreshHookDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        CommandAlias::query()->create(['name' => 'tests', 'line' => 'php artisan test']);
    }

    /**
     * @return iterable<string, array{string, AnswerType, AnswerType}>
     */
    public static function linesAndRoleAnswers(): iterable
    {
        yield 'a command alias' => ['journal run tests', AnswerType::Allow, AnswerType::Allow];
        yield 'a command alias by its name' => ['journal tests --tail 5', AnswerType::Allow, AnswerType::Allow];
        yield 'a journal subcommand' => ['journal task list', AnswerType::Allow, AnswerType::Allow];
        yield 'an unknown journal name' => ['journal not-saved', AnswerType::Deny, AnswerType::Deny];
        yield 'an unknown command alias' => ['journal run not-saved', AnswerType::Deny, AnswerType::Deny];
        yield 'a plain read' => ['git status', AnswerType::Allow, AnswerType::Allow];
        yield 'a quoted search' => ['grep -rn "needs work" app', AnswerType::Allow, AnswerType::Allow];
        yield 'an unsaved test run' => ['composer test', AnswerType::Deny, AnswerType::Deny];
        yield 'a test run behind an assignment' => ['APP_ENV=testing vendor/bin/phpunit', AnswerType::Deny, AnswerType::Deny];
        yield 'a test run in a pipe' => ['php artisan test | tail -5', AnswerType::Deny, AnswerType::Deny];
        yield 'a build after a read' => ['ls && npm run build', AnswerType::Deny, AnswerType::Deny];
        yield 'a file removal' => ['rm -rf build', AnswerType::Allow, AnswerType::Deny];
        yield 'a write through a redirect' => ['echo done > notes.txt', AnswerType::Allow, AnswerType::Deny];
        yield 'a write through a redirect without spaces' => ['cat a.txt>b.txt', AnswerType::Allow, AnswerType::Deny];
        yield 'an unknown program' => ['some-tool --flag', AnswerType::Allow, AnswerType::Deny];
        yield 'a command substitution' => ['$(echo composer) test', AnswerType::Deny, AnswerType::Deny];
        yield 'a variable' => ['cat $FILE', AnswerType::Deny, AnswerType::Deny];
        yield 'a quote left open' => ['echo "unfinished', AnswerType::Deny, AnswerType::Deny];
    }

    #[DataProvider('linesAndRoleAnswers')]
    public function test_the_parsed_facts_decide_each_role_answer(string $line, AnswerType $mainAgent, AnswerType $readOnlyHelper): void
    {
        $this->assertSame($mainAgent, $this->answer(new MainAgentReadyState, $line));
        $this->assertSame($readOnlyHelper, $this->answer(new ReadOnlyHelperReadyState, $line));
    }

    public function test_the_app_reads_shell_commands_with_the_processes_parser(): void
    {
        $this->assertInstanceOf(ShellParser::class, $this->app->make(ShellCommandParser::class));
    }

    public function test_a_line_is_split_into_its_commands_and_joins(): void
    {
        $command = $this->parse('APP_ENV=testing composer test 2>&1 | tee log.txt; git status');

        $this->assertSame(ParseOutcome::Complete, $command->outcome);
        $this->assertSame(['composer', 'tee', 'git'], array_map(fn ($part) => $part->program, $command->parts));
        $this->assertSame([PartJoin::Pipe, PartJoin::Sequence, PartJoin::End], array_map(fn ($part) => $part->join, $command->parts));
        $this->assertSame([CommandType::TestRun, CommandType::Ordinary, CommandType::Ordinary], array_map(fn ($part) => $part->type, $command->parts));
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

    public function test_a_comment_or_a_flag_does_not_make_a_test_run_saved(): void
    {
        foreach (['composer test --saved', 'SAVED=1 composer test', 'composer test # journal'] as $line) {
            $this->assertTrue($this->parse($line)->needsAlias(), $line);
        }
    }

    public function test_without_a_parser_every_shell_command_fails_by_name(): void
    {
        $this->expectException(ShellParserMissing::class);

        (new MissingShellParser)->parse('git status', ShellDialect::Bash);
    }

    private function parse(string $line): ShellCommand
    {
        return $this->app->make(ShellCommandParser::class)->parse($line, ShellDialect::Bash);
    }

    private function answer(ReadyState $ready, string $line): AnswerType
    {
        return (new ShellCommandRequested(new HookIdentity(1, 10, 'call-1', 'digest'), $this->parse($line)))->answerBy($ready)->answerType();
    }
}
