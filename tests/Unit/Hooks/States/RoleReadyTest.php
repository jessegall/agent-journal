<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks\States;

use App\Hooks\Contracts\HookInput;
use App\Hooks\Decisions\Decision;
use App\Hooks\Decisions\Denied;
use App\Hooks\Enums\AnswerType;
use App\Hooks\Enums\FileOperation;
use App\Hooks\Enums\ReadyStateType;
use App\Hooks\Exceptions\UnknownReadyState;
use App\Hooks\Inputs\FileChange;
use App\Hooks\Inputs\FileChanges;
use App\Hooks\Inputs\FileEditRequested;
use App\Hooks\Inputs\HookIdentity;
use App\Hooks\Inputs\ShellCommandRequested;
use App\Hooks\States\MainAgentReadyState;
use App\Hooks\States\ReadOnlyHelperReadyState;
use App\Hooks\States\ReadyState;
use App\Processes\Enums\CommandEffect;
use App\Processes\Enums\CommandType;
use App\Processes\Enums\ParseOutcome;
use App\Processes\Enums\PartJoin;
use App\Processes\Enums\ShellDialect;
use App\Processes\Values\CommandPart;
use App\Processes\Values\ShellCommand;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Hooks\HookInputs;
use Tests\Support\TestIds;

final class RoleReadyTest extends TestCase
{
    /**
     * @return iterable<string, array{ReadyState}>
     */
    public static function roles(): iterable
    {
        yield 'main agent' => [new MainAgentReadyState()];
        yield 'read-only helper' => [new ReadOnlyHelperReadyState()];
    }

    /**
     * @return iterable<string, array{ReadyState, ShellCommand}>
     */
    public static function commandsWithoutAlias(): iterable
    {
        foreach (self::roles() as $role => [$ready]) {
            yield "{$role}, a test run" => [$ready, self::line([self::part(CommandType::TestRun)])];
            yield "{$role}, a build" => [$ready, self::line([self::part(CommandType::Build)])];
            yield "{$role}, an unnamed program" => [$ready, self::line([self::part(CommandType::Unknown)])];
            yield "{$role}, a test run piped behind a read" => [$ready, self::line([
                self::part(CommandType::Ordinary, join: PartJoin::Pipe),
                self::part(CommandType::TestRun),
            ])];
            yield "{$role}, a dynamic expansion" => [$ready, self::line([self::part(CommandType::Ordinary)], ParseOutcome::DynamicExpansion)];
            yield "{$role}, an unparsed line" => [$ready, self::line([], ParseOutcome::Unparsed)];
        }
    }

    /**
     * @return iterable<string, array{ShellCommand}>
     */
    public static function helperWrites(): iterable
    {
        yield 'a command alias that writes' => [self::line([self::part(CommandType::Alias, CommandEffect::ChangesFiles)])];
        yield 'an ordinary write' => [self::line([self::part(CommandType::Ordinary, CommandEffect::ChangesFiles)])];
        yield 'an unknown effect' => [self::line([self::part(CommandType::Ordinary, CommandEffect::Unknown)])];
    }

    #[DataProvider('commandsWithoutAlias')]
    public function test_each_role_refuses_a_command_that_must_be_saved_or_cannot_be_read(ReadyState $ready, ShellCommand $command): void
    {
        $decision = $ready->onShellCommand($this->request($command));

        $this->assertInstanceOf(Denied::class, $decision->answer);
        $this->assertStringContainsString('journal run', $decision->refusalReason());
    }

    #[DataProvider('roles')]
    public function test_each_role_allows_a_command_alias_and_an_ordinary_read(ReadyState $ready): void
    {
        $saved = self::line([self::part(CommandType::Alias)]);
        $read = self::line([self::part(CommandType::Ordinary)]);

        $this->assertSame(AnswerType::Allow, $ready->onShellCommand($this->request($saved))->answerType());
        $this->assertSame(AnswerType::Allow, $ready->onShellCommand($this->request($read))->answerType());
    }

    public function test_the_main_agent_may_run_a_write_and_edit_files(): void
    {
        $write = self::line([self::part(CommandType::Ordinary, CommandEffect::ChangesFiles)]);

        $this->assertSame(AnswerType::Allow, new MainAgentReadyState()->onShellCommand($this->request($write))->answerType());
        $this->assertSame(AnswerType::Allow, new MainAgentReadyState()->onFileEdit($this->edit(['app/Domains/Contracts/Domain.php']))->answerType());
    }

    #[DataProvider('helperWrites')]
    public function test_a_read_only_helper_refuses_any_command_that_may_change_files(ShellCommand $command): void
    {
        $decision = new ReadOnlyHelperReadyState()->onShellCommand($this->request($command));

        $this->assertInstanceOf(Denied::class, $decision->answer);
        $this->assertStringContainsString('changes no files', $decision->refusalReason());
    }

    public function test_a_read_only_helper_refuses_an_edit_and_names_every_path(): void
    {
        $decision = new ReadOnlyHelperReadyState()->onFileEdit($this->edit(['app/Domains/Contracts/Domain.php', 'docs/hooks/dependencies.md']));

        $this->assertInstanceOf(Denied::class, $decision->answer);
        $this->assertStringContainsString('app/Domains/Contracts/Domain.php, docs/hooks/dependencies.md', $decision->refusalReason());
    }

    #[DataProvider('roles')]
    public function test_each_role_still_answers_every_hook_without_delegating(ReadyState $ready): void
    {
        foreach (HookInputs::all() as $input) {
            $this->assertFalse($this->answerOf($input, $ready)->isDelegating());
        }
    }

    public function test_each_type_key_builds_its_own_bottom_state(): void
    {
        $this->assertInstanceOf(MainAgentReadyState::class, ReadyStateType::forKey('hooks.main_ready')->newState());
        $this->assertSame(ReadOnlyHelperReadyState::class, ReadyStateType::forKey('hooks.read_only_helper_ready')->newState()::class);
        $this->assertSame(MainAgentReadyState::class, ReadyStateType::MainAgent->newState()::class);
    }

    public function test_an_unknown_role_cannot_be_launched(): void
    {
        $this->expectException(UnknownReadyState::class);

        ReadyStateType::forKey('hooks.ready');
    }

    /**
     * @param  list<CommandPart>  $parts
     */
    private static function line(array $parts, ParseOutcome $outcome = ParseOutcome::Complete): ShellCommand
    {
        return new ShellCommand('the line', ShellDialect::Bash, $outcome, $parts);
    }

    private static function part(
        CommandType $type,
        CommandEffect $effect = CommandEffect::ReadsOnly,
        PartJoin $join = PartJoin::End,
    ): CommandPart {
        return new CommandPart('program', [], $effect, $type, $join);
    }

    private function request(ShellCommand $command): ShellCommandRequested
    {
        return new ShellCommandRequested($this->hook(), $command);
    }

    /**
     * @param  list<string>  $paths
     */
    private function edit(array $paths): FileEditRequested
    {
        return new FileEditRequested($this->hook(), new FileChanges(array_map(
            fn (string $path) => new FileChange($path, FileOperation::Edit),
            $paths,
        )));
    }

    private function answerOf(HookInput $input, ReadyState $ready): Decision
    {
        return $input->answerBy($ready);
    }

    private function hook(): HookIdentity
    {
        return new HookIdentity(TestIds::of(1), TestIds::of(2), 'hook-1', 'digest');
    }
}
