<?php

declare(strict_types=1);

namespace Domain\Sequences\Tests\Feature;

use App\Contracts\Actors\AgentTexts;
use App\Enums\Drivers\RewriteSupport;
use App\Support\Drivers\DriverCapabilities;
use App\Support\Drivers\DriverReplies;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\Stack\HookAnswer;
use App\Support\StateLoading\RegisteredStateType;
use App\Support\StateLoading\StateBuilder;
use Domain\Sequences\Commands\AdvanceSequence\AdvanceSequenceCommand;
use Domain\Sequences\Support\States\FollowSequenceState;
use Domain\Sequences\Tests\Fixtures\SequenceFixtures;
use Domain\Sequences\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestText;

final class SequenceStateContributionTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The bus and the hooks commit for real, so these tables are emptied around each test.
     */
    private const array TABLES = ['sequence_runs', 'agent_stacks', 'hook_calls', 'command_receipts'];

    private const string RUN = 'Close a task';

    private SequenceFixtures $runs;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('Writer')->actAs('Writer');
        $this->runs = $this->journal->fixtures(SequenceFixtures::class)
            ->run(self::RUN, ['Read the brief.', 'Run the phase tests.'])
            ->startRun(self::RUN, 'Writer');
    }

    public function test_each_hook_reads_the_current_step_fresh(): void
    {
        $onFirstStep = $this->stopReply();
        $this->journal->run(new AdvanceSequenceCommand($this->runs->runCalled(self::RUN)->id));
        $onSecondStep = $this->stopReply();

        $this->assertStringContainsString($this->stepText(1), $onFirstStep);
        $this->assertStringContainsString($this->stepText(2), $onSecondStep);
    }

    private function stepText(int $step): string
    {
        $run = $this->runs->runCalled(self::RUN);
        $values = ['runId' => $run->id, 'runNumber' => $run->number, 'steps' => $run->steps, 'currentStep' => $step];

        return TestText::words($this->app->make(StateBuilder::class)
            ->build(RegisteredStateType::of(FollowSequenceState::class), $values)
            ->instruction()
            ->get());
    }

    /**
     * What the program is told when the agent asks to stop.
     */
    private function stopReply(): string
    {
        $answer = $this->answer($this->journal->hooksFor($this->journal->sessionOf('Writer'))->stop(), 'onStop');

        return DriverReplies::stop($answer, $this->journal->service(AgentTexts::class))->stdout;
    }

    private function answer(HookInput $input, string $method): HookAnswer
    {
        $driver = new DriverCapabilities(
            'Test program',
            'stop and compaction replies',
            [$method],
            RewriteSupport::WithoutApproval,
        );

        return $this->journal->answerHook($this->journal->sessionOf('Writer'), $input, $driver);
    }
}
