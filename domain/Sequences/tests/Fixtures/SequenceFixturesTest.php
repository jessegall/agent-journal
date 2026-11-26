<?php

declare(strict_types=1);

namespace Domain\Sequences\Tests\Fixtures;

use App\Exceptions\StackAlreadyClosed;
use App\Models\Agents\AgentStackRow;
use Carbon\CarbonImmutable;
use Domain\Sequences\Commands\AdvanceSequence\AdvanceSequenceCommand;
use Domain\Sequences\Enums\SequenceRunStatus;
use Domain\Sequences\Tests\TestCase;
use PHPUnit\Framework\AssertionFailedError;
use Tests\Support\CommitsHookRows;

/**
 * A run started through the journal follows the named agent at its first step; a start whose push fails reaches the
 * caller and leaves the run unassigned where it was.
 */
final class SequenceFixturesTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'sequence_runs',
        'agent_stacks',
        'agents',
        'agent_sessions',
        'users',
    ];

    public function test_a_started_run_follows_the_agent_at_its_first_step(): void
    {
        $runs = $this->journal->owner()->agent('Ada')->fixtures(SequenceFixtures::class)
            ->run('Close', ['Read the brief.', 'Run the phase tests.'])
            ->startRun('Close', 'Ada');

        $runs->assertStep('Close', step: 1, follower: 'Ada');
    }

    public function test_a_created_run_is_given_back_and_still_found_by_its_name(): void
    {
        $runs = $this->journal->owner()->fixtures(SequenceFixtures::class);

        $this->assertTrue($runs->createRun('Close', ['Read the brief.'])->is($runs->runCalled('Close')));
    }

    public function test_a_failed_push_leaves_the_run_unassigned_where_it_was(): void
    {
        $runs = $this->journal->owner()->agent('Ada')->fixtures(SequenceFixtures::class)->run(
            'Close',
            ['Read the brief.'],
        );

        AgentStackRow::query()->withoutGlobalScopes()->where(
            'session_id',
            $this->journal->sessionOf('Ada')->id,
        )->sole()->closeAt(CarbonImmutable::now());

        $this->journal->assertRefused(StackAlreadyClosed::class, fn () => $runs->startRun('Close', 'Ada'));

        $runs->assertUnassigned('Close', priorStep: 1, priorStatus: SequenceRunStatus::Running);
    }

    public function test_a_run_past_its_last_step_is_finished_and_a_running_one_is_not(): void
    {
        $runs = $this->journal->owner()->agent('Ada')->fixtures(SequenceFixtures::class)
            ->run('Close', ['Read the brief.'])
            ->run('Open', ['Read the brief.'])
            ->startRun('Close', 'Ada');

        $this->journal->runAs('Ada', new AdvanceSequenceCommand($runs->runCalled('Close')->id));

        $runs->assertFinished('Close');
        $this->assertThrows(fn () => $runs->assertFinished('Open'), AssertionFailedError::class);
    }
}
