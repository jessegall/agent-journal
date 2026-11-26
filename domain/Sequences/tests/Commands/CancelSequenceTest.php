<?php

declare(strict_types=1);

namespace Domain\Sequences\Tests\Commands;

use Domain\Sequences\Commands\CancelSequence\CancelSequenceCommand;
use Domain\Sequences\Enums\SequenceRunStatus;
use Domain\Sequences\Tests\Fixtures\SequenceFixtures;
use Domain\Sequences\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;

/**
 * A running sequence is cancelled and stays at the step it reached.
 */
#[TestsCommand(CancelSequenceCommand::class)]
final class CancelSequenceTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The bus commits these commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = [
        'sequence_runs',
        'agent_stacks',
        'command_receipts',
    ];

    private const string RUN = 'Close a task';

    private SequenceFixtures $runs;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('Writer')->actAs('Writer');

        $this->runs = $this->journal->fixtures(SequenceFixtures::class)->run(self::RUN, [
            'Read the brief.',
            'Run the phase tests.',
        ]);
    }

    public function test_a_cancelled_run_stays_at_the_step_it_reached(): void
    {
        $this->runs->startRun(self::RUN, 'Writer');

        $this->journal->run(new CancelSequenceCommand($this->runs->runCalled(self::RUN)->id));

        $run = $this->runs->runCalled(self::RUN);

        $this->assertSame([
            SequenceRunStatus::Cancelled,
            1,
        ], [
            $run->status,
            $run->current_step,
        ]);
    }
}
