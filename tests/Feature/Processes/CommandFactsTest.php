<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Core\Hooks\Contracts\ShellCommandParser;
use App\Core\Hooks\Decisions\AnswerKind;
use App\Core\Hooks\Exceptions\ShellParserMissing;
use App\Core\Hooks\Inputs\CommandEffect;
use App\Core\Hooks\Inputs\CommandKind;
use App\Core\Hooks\Inputs\HookIdentity;
use App\Core\Hooks\Inputs\MissingShellParser;
use App\Core\Hooks\Inputs\ParseOutcome;
use App\Core\Hooks\Inputs\PartJoin;
use App\Core\Hooks\Inputs\ShellCommand;
use App\Core\Hooks\Inputs\ShellCommandRequested;
use App\Core\Hooks\Inputs\ShellDialect;
use App\Core\Hooks\States\MainAgentReadyState;
use App\Core\Hooks\States\ReadOnlyHelperReadyState;
use App\Core\Hooks\States\ReadyState;
use App\Domain\Processes\Models\SavedCommand;
use App\Domain\Processes\Support\ShellParser;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

final class CommandFactsTest extends TestCase
{
    use RefreshHookDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        SavedCommand::query()->create(['name' => 'tests', 'line' => 'php artisan test']);
    }

    /**
     * @return iterable<string, array{string, AnswerKind, AnswerKind}>
     */
    public static function linesAndRoleAnswers(): iterable
    {
        yield 'a saved command' => ['journal run tests', AnswerKind::Allow, AnswerKind::Allow];
        yield 'a saved command by its name' => ['journal tests --tail 5', AnswerKind::Allow, AnswerKind::Allow];
        yield 'a journal subcommand' => ['journal task list', AnswerKind::Allow, AnswerKind::Allow];
        yield 'an unknown journal name' => ['journal not-saved', AnswerKind::Deny, AnswerKind::Deny];
        yield 'an unknown saved command' => ['journal run not-saved', AnswerKind::Deny, AnswerKind::Deny];
        yield 'a plain read' => ['git status', AnswerKind::Allow, AnswerKind::Allow];
        yield 'a quoted search' => ['grep -rn "needs work" app', AnswerKind::Allow, AnswerKind::Allow];
        yield 'an unsaved test run' => ['composer test', AnswerKind::Deny, AnswerKind::Deny];
        yield 'a test run behind an assignment' => ['APP_ENV=testing vendor/bin/phpunit', AnswerKind::Deny, AnswerKind::Deny];
        yield 'a test run in a pipe' => ['php artisan test | tail -5', AnswerKind::Deny, AnswerKind::Deny];
        yield 'a build after a read' => ['ls && npm run build', AnswerKind::Deny, AnswerKind::Deny];
        yield 'a file removal' => ['rm -rf build', AnswerKind::Allow, AnswerKind::Deny];
        yield 'a write through a redirect' => ['echo done > notes.txt', AnswerKind::Allow, AnswerKind::Deny];
        yield 'a write through a redirect without spaces' => ['cat a.txt>b.txt', AnswerKind::Allow, AnswerKind::Deny];
        yield 'an unknown program' => ['some-tool --flag', AnswerKind::Allow, AnswerKind::Deny];
        yield 'a command substitution' => ['$(echo composer) test', AnswerKind::Deny, AnswerKind::Deny];
        yield 'a variable' => ['cat $FILE', AnswerKind::Deny, AnswerKind::Deny];
        yield 'a quote left open' => ['echo "unfinished', AnswerKind::Deny, AnswerKind::Deny];
    }

    #[DataProvider('linesAndRoleAnswers')]
    public function test_the_parsed_facts_decide_each_role_answer(string $line, AnswerKind $mainAgent, AnswerKind $readOnlyHelper): void
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
        $this->assertSame([CommandKind::TestRun, CommandKind::Ordinary, CommandKind::Ordinary], array_map(fn ($part) => $part->kind, $command->parts));
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
            $this->assertTrue($this->parse($line)->needsSavedCommand(), $line);
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

    private function answer(ReadyState $ready, string $line): AnswerKind
    {
        return (new ShellCommandRequested(new HookIdentity(1, 10, 'call-1', 'digest'), $this->parse($line)))->answerBy($ready)->answerKind();
    }
}
