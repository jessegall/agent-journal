<?php

declare(strict_types=1);

namespace Tests\Unit\Skills\States;

use App\Enums\AnswerType;
use App\Enums\CommandEffect;
use App\Enums\CommandType;
use App\Enums\FileOperation;
use App\Enums\ParseOutcome;
use App\Enums\PublicationState;
use App\Enums\ShellDialect;
use App\Events\SkillPublicationMoved;
use App\Support\Decisions\Denied;
use App\Support\Inputs\FileEditRequested;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Inputs\Values\FileChange;
use App\Support\Inputs\Values\FileChanges;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\States\AwaitingSkillsState;
use App\Values\CommandPart;
use App\Values\ShellCommand;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Support\TestActors;
use Tests\Support\TestText;
use Tests\TestCase;

/**
 * A session whose new skill set waits holds its file changes with a reason, lets reads such as skill:status through,
 * and ends once the publication settles.
 */
final class AwaitingSkillsStateTest extends TestCase
{
    private const string STATUS_COMMAND = 'php artisan skill:status';

    /**
     * @return iterable<string, array{PublicationState}>
     */
    public static function waitingStates(): iterable
    {
        yield 'pending' => [PublicationState::Pending];

        yield 'preparing' => [PublicationState::Preparing];

        yield 'failed' => [PublicationState::Failed];
    }

    /**
     * @return iterable<string, array{PublicationState}>
     */
    public static function settledStates(): iterable
    {
        yield 'delivered' => [PublicationState::Delivered];

        yield 'superseded' => [PublicationState::Superseded];

        yield 'retired' => [PublicationState::Retired];
    }

    #[DataProvider('waitingStates')]
    public function test_a_file_change_is_held_with_the_reason_while_the_set_waits(PublicationState $state): void
    {
        $awaiting = $this->awaiting($state);
        $edit = new FileEditRequested(
            $this->hook(),
            new FileChanges([new FileChange('app/Thing.php', FileOperation::Edit)]),
        );
        $write = new ShellCommandRequested($this->hook(), self::command('tee', CommandEffect::ChangesFiles));

        $this->assertInstanceOf(Denied::class, $awaiting->onFileEdit($edit)->answer);
        $this->assertInstanceOf(Denied::class, $awaiting->onShellCommand($write)->answer);
        $this->assertStringContainsString(self::STATUS_COMMAND, TestText::words($awaiting->onFileEdit($edit)->refusalReason()));
        $this->assertFalse($awaiting->isFinished());
    }

    public function test_a_held_session_can_still_run_skill_status(): void
    {
        $status = new ShellCommandRequested($this->hook(), self::command('php', CommandEffect::ReadsOnly));

        $decision = $this->awaiting(PublicationState::Pending)->onShellCommand($status);

        $this->assertSame(AnswerType::Delegate, $decision->answerType());
    }

    #[DataProvider('settledStates')]
    public function test_a_settled_publication_ends_the_hold(PublicationState $state): void
    {
        $this->assertTrue($this->awaiting($state)->isFinished());
    }

    public function test_another_publication_moving_leaves_the_hold(): void
    {
        $awaiting = new AwaitingSkillsState('publication-1');
        $moved = new SkillPublicationMoved('publication-2', 'session-1', PublicationState::Delivered);

        $awaiting->onSkillPublicationMoved($moved);

        $this->assertFalse($awaiting->isFinished());
    }

    /**
     * A state waiting for publication 1, which it has heard move to the state given.
     */
    private function awaiting(PublicationState $state): AwaitingSkillsState
    {
        $awaiting = new AwaitingSkillsState('publication-1');
        $awaiting->onSkillPublicationMoved(new SkillPublicationMoved('publication-1', 'session-1', $state));

        return $awaiting;
    }

    private static function command(string $driver, CommandEffect $effect): ShellCommand
    {
        return new ShellCommand(
            "{$driver} artisan skill:status",
            ShellDialect::Bash,
            ParseOutcome::Complete,
            [new CommandPart($driver, ['artisan', 'skill:status'], $effect, CommandType::Ordinary)],
        );
    }

    private function hook(): HookIdentity
    {
        return TestActors::hookIdentity(1, 2, 'hook-1', 'digest');
    }
}
