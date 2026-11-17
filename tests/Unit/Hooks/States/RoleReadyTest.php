<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks\States;

use App\Core\Hooks\Contracts\HookInput;
use App\Core\Hooks\Decisions\AnswerKind;
use App\Core\Hooks\Decisions\Decision;
use App\Core\Hooks\Decisions\Denied;
use App\Core\Hooks\Exceptions\UnknownReadyState;
use App\Core\Hooks\Inputs\CommandEffect;
use App\Core\Hooks\Inputs\CommandKind;
use App\Core\Hooks\Inputs\CommandPart;
use App\Core\Hooks\Inputs\FileChange;
use App\Core\Hooks\Inputs\FileChanges;
use App\Core\Hooks\Inputs\FileEditRequested;
use App\Core\Hooks\Inputs\FileOperation;
use App\Core\Hooks\Inputs\HookIdentity;
use App\Core\Hooks\Inputs\ParseOutcome;
use App\Core\Hooks\Inputs\PartJoin;
use App\Core\Hooks\Inputs\ShellCommand;
use App\Core\Hooks\Inputs\ShellCommandRequested;
use App\Core\Hooks\Inputs\ShellDialect;
use App\Core\Hooks\States\MainAgentReady;
use App\Core\Hooks\States\ReadOnlyHelperReady;
use App\Core\Hooks\States\Ready;
use App\Core\Hooks\States\ReadyStateType;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Hooks\HookInputs;

final class RoleReadyTest extends TestCase
{
    /**
     * @return iterable<string, array{Ready}>
     */
    public static function roles(): iterable
    {
        yield 'main agent' => [new MainAgentReady];
        yield 'read-only helper' => [new ReadOnlyHelperReady];
    }

    /**
     * @return iterable<string, array{Ready, ShellCommand}>
     */
    public static function unsavedCommands(): iterable
    {
        foreach (self::roles() as $role => [$ready]) {
            yield "{$role}, a test run" => [$ready, self::line([self::part(CommandKind::TestRun)])];
            yield "{$role}, a build" => [$ready, self::line([self::part(CommandKind::Build)])];
            yield "{$role}, an unnamed program" => [$ready, self::line([self::part(CommandKind::Unknown)])];
            yield "{$role}, a test run piped behind a read" => [$ready, self::line([
                self::part(CommandKind::Ordinary, join: PartJoin::Pipe),
                self::part(CommandKind::TestRun),
            ])];
            yield "{$role}, a dynamic expansion" => [$ready, self::line([self::part(CommandKind::Ordinary)], ParseOutcome::DynamicExpansion)];
            yield "{$role}, an unparsed line" => [$ready, self::line([], ParseOutcome::Unparsed)];
        }
    }

    /**
     * @return iterable<string, array{ShellCommand}>
     */
    public static function helperWrites(): iterable
    {
        yield 'a saved command that writes' => [self::line([self::part(CommandKind::SavedCommand, CommandEffect::ChangesFiles)])];
        yield 'an ordinary write' => [self::line([self::part(CommandKind::Ordinary, CommandEffect::ChangesFiles)])];
        yield 'an unknown effect' => [self::line([self::part(CommandKind::Ordinary, CommandEffect::Unknown)])];
    }

    #[DataProvider('unsavedCommands')]
    public function test_each_role_refuses_a_command_that_must_be_saved_or_cannot_be_read(Ready $ready, ShellCommand $command): void
    {
        $decision = $ready->onShellCommand($this->request($command));

        $this->assertInstanceOf(Denied::class, $decision->answer);
        $this->assertStringContainsString('journal run', $decision->refusalReason());
    }

    #[DataProvider('roles')]
    public function test_each_role_allows_a_saved_command_and_an_ordinary_read(Ready $ready): void
    {
        $saved = self::line([self::part(CommandKind::SavedCommand)]);
        $read = self::line([self::part(CommandKind::Ordinary)]);

        $this->assertSame(AnswerKind::Allow, $ready->onShellCommand($this->request($saved))->answerKind());
        $this->assertSame(AnswerKind::Allow, $ready->onShellCommand($this->request($read))->answerKind());
    }

    public function test_the_main_agent_may_run_a_write_and_edit_files(): void
    {
        $write = self::line([self::part(CommandKind::Ordinary, CommandEffect::ChangesFiles)]);

        $this->assertSame(AnswerKind::Allow, (new MainAgentReady)->onShellCommand($this->request($write))->answerKind());
        $this->assertSame(AnswerKind::Allow, (new MainAgentReady)->onFileEdit($this->edit(['app/Domain/Domain.php']))->answerKind());
    }

    #[DataProvider('helperWrites')]
    public function test_a_read_only_helper_refuses_any_command_that_may_change_files(ShellCommand $command): void
    {
        $decision = (new ReadOnlyHelperReady)->onShellCommand($this->request($command));

        $this->assertInstanceOf(Denied::class, $decision->answer);
        $this->assertStringContainsString('changes no files', $decision->refusalReason());
    }

    public function test_a_read_only_helper_refuses_an_edit_and_names_every_path(): void
    {
        $decision = (new ReadOnlyHelperReady)->onFileEdit($this->edit(['app/Domain/Domain.php', 'docs/hooks/dependencies.md']));

        $this->assertInstanceOf(Denied::class, $decision->answer);
        $this->assertStringContainsString('app/Domain/Domain.php, docs/hooks/dependencies.md', $decision->refusalReason());
    }

    #[DataProvider('roles')]
    public function test_each_role_still_answers_every_hook_without_delegating(Ready $ready): void
    {
        foreach (HookInputs::all() as $input) {
            $this->assertFalse($this->answerOf($input, $ready)->isDelegating());
        }
    }

    public function test_each_type_key_builds_its_own_bottom_state(): void
    {
        $this->assertInstanceOf(MainAgentReady::class, ReadyStateType::forKey('hooks.main_ready')->newState());
        $this->assertSame(ReadOnlyHelperReady::class, ReadyStateType::forKey('hooks.read_only_helper_ready')->newState()::class);
        $this->assertSame(MainAgentReady::class, ReadyStateType::MainAgent->newState()::class);
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
        CommandKind $kind,
        CommandEffect $effect = CommandEffect::ReadsOnly,
        PartJoin $join = PartJoin::End,
    ): CommandPart {
        return new CommandPart('program', [], $effect, $kind, $join);
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

    private function answerOf(HookInput $input, Ready $ready): Decision
    {
        return $input->answerBy($ready);
    }

    private function hook(): HookIdentity
    {
        return new HookIdentity(1, 2, 'hook-1', 'digest');
    }
}
