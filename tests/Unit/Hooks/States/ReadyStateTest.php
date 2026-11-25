<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks\States;

use App\Enums\CommandRules\CommandEffect;
use App\Enums\CommandRules\CommandType;
use App\Enums\CommandRules\ParseOutcome;
use App\Enums\Files\FileOperation;
use App\Enums\Hooks\AnswerType;
use App\Enums\Processes\ShellDialect;
use App\Enums\Runs\PartJoin;
use App\Support\Decisions\Denied;
use App\Support\Inputs\FileEditRequested;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Inputs\Values\FileChange;
use App\Support\Inputs\Values\FileChanges;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\States\ReadyState;
use App\Values\CommandPart;
use App\Values\ShellCommand;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Fixtures\Hooks\AllowedStops;
use Tests\Fixtures\Hooks\FixedOperationPolicy;
use Tests\Support\TestActors;
use Tests\Support\TestText;
use Tests\TestCase;

/**
 * The one ready bottom state: it leaves every shell line to Core's admission, answers every hook, and lets a file
 * change
 * only when the agent's profile grants it.
 */
final class ReadyStateTest extends TestCase
{
    /**
     * @return iterable<string, array{ReadyState}>
     */
    public static function roles(): iterable
    {
        yield 'a profile that edits files' => [new ReadyState(new FixedOperationPolicy(true), new AllowedStops())];

        yield 'a profile that edits none' => [new ReadyState(new FixedOperationPolicy(false), new AllowedStops())];
    }

    /**
     * Every kind of shell line, including those Core's admission refuses: the ready states leave each to it.
     *
     * @return iterable<string, array{ReadyState, ShellCommand}>
     */
    public static function rolesAndLines(): iterable
    {
        foreach (self::roles() as $role => [$ready]) {
            yield "{$role}, a command alias" => [$ready, self::line([self::part(CommandType::Alias)])];

            yield "{$role}, an ordinary read" => [$ready, self::line([self::part(CommandType::Ordinary)])];

            yield "{$role}, a test run" => [$ready, self::line([self::part(CommandType::Verification)])];

            yield "{$role}, a build" => [$ready, self::line([self::part(CommandType::Build)])];

            yield "{$role}, an unnamed driver" => [$ready, self::line([self::part(CommandType::Unknown)])];

            yield "{$role}, a write" => [
                $ready,
                self::line([self::part(CommandType::Ordinary, CommandEffect::ChangesFiles)]),
            ];

            yield "{$role}, a dynamic expansion" => [
                $ready,
                self::line([self::part(CommandType::Ordinary)], ParseOutcome::DynamicExpansion),
            ];

            yield "{$role}, an unparsed line" => [$ready, self::line([], ParseOutcome::Unparsed)];
        }
    }

    #[DataProvider('rolesAndLines')]
    public function test_each_role_leaves_every_shell_line_to_cores_admission(
        ReadyState $ready,
        ShellCommand $command,
    ): void {
        $this->assertSame(AnswerType::Delegate, $ready->onShellCommand($this->request($command))->answerType());
    }

    public function test_a_profile_that_edits_files_may_edit(): void
    {
        $edit = $this->edit(['app/Domains/Contracts/Domain.php']);

        $decision = new ReadyState(new FixedOperationPolicy(true), new AllowedStops())->onFileEdit($edit);

        $this->assertSame(AnswerType::Delegate, $decision->answerType());
    }

    public function test_a_profile_without_file_changes_refuses_the_whole_edit_by_its_first_path(): void
    {
        $decision = new ReadyState(new FixedOperationPolicy(false), new AllowedStops())->onFileEdit(
            $this->edit(['app/Domains/Contracts/Domain.php', 'docs/hooks/dependencies.md']),
        );

        $this->assertInstanceOf(Denied::class, $decision->answer);
        $this->assertStringContainsString('app/Domains/Contracts/Domain.php', TestText::words($decision->refusalReason()));
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
        return new CommandPart('driver', [], $effect, $type, $join);
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

    private function hook(): HookIdentity
    {
        return TestActors::hookIdentity(1, 2, 'hook-1', 'digest');
    }
}
