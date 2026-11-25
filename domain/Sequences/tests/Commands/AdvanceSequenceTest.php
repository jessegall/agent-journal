<?php

declare(strict_types=1);

namespace Domain\Sequences\Tests\Commands;

use Domain\Sequences\Commands\AdvanceSequence\AdvanceSequenceCommand;
use Domain\Sequences\Tests\Fixtures\SequenceFixtures;
use Domain\Sequences\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;

/**
 * A running sequence goes to its next step, and finishes once its last step is done.
 */
#[TestsCommand(AdvanceSequenceCommand::class)]
final class AdvanceSequenceTest extends TestCase
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

    public function test_a_run_goes_to_its_next_step_and_finishes_after_its_last(): void
    {
        $this->runs->startRun(self::RUN, 'Writer');

        $this->journal->run(new AdvanceSequenceCommand($this->runs->runCalled(self::RUN)->id));
        $this->runs->assertStep(self::RUN, 2, 'Writer');

        $this->journal->run(new AdvanceSequenceCommand($this->runs->runCalled(self::RUN)->id));
        $this->runs->assertFinished(self::RUN);
    }
}
