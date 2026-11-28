<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Enums\SessionProcessStatus;
use App\Exceptions\HostProtocolRefused;
use App\Hosts\Commands\NotifyHostInstruction\NotifyHostInstructionCommand;
use App\Hosts\Enums\HostInstructionStatus;
use App\Hosts\Enums\HostProcessStatus;
use App\Hosts\Exceptions\HostCallUnreadable;
use App\Hosts\ProcessFeed;
use App\Hosts\Protocol\HostRefusal;
use Tests\Support\Agents\TestAgent;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Hosts\TestEnrolledHost;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A host's answer is stored on its instruction with its facts, the process's worker receives of it, and an answer to another
 * host's instruction is refused.
 */
#[TestsCommand(NotifyHostInstructionCommand::class)]
final class NotifyHostInstructionTest extends TestCase
{
    use RefreshHookDatabase;
    use WithActiveAccount;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal
            ->enrollHost('Mac', [base_path()])
            ->enrollHost('Other', [base_path()])
            ->host('Mac', fn (TestEnrolledHost $mac) => $mac
                ->openProcess('shell'));
    }

    public function test_a_refused_answer_is_stored_with_its_facts_and_its_worker_is_woken(): void
    {
        [$open] = $this->journal->hostInstructionsOf('shell');

        $this->journal->asSystem(new NotifyHostInstructionCommand(
            $this->journal->hostCalled('Mac')->hostId,
            $open->id,
            $this->refusedAnswerTo($open->id),
        ));

        $open->refresh();
        $heard = $this->journal->service(ProcessFeed::class)->after(
            $open->host_process_id,
            ProcessFeed::FIRST_CURSOR,
            0,
        );
        $this->journal->assertResult(
            [HostInstructionStatus::Refused, HostRefusal::GuardMoved, ['row_hash' => 'abc'], $open->id],
            [$open->status, $open->refusal, $open->answer?->facts, $heard[0]->answeredInstructionId],
        );
    }

    public function test_a_refused_open_instruction_loses_its_process_with_the_refusal_and_the_hosts_reason_as_evidence(): void
    {
        [$open] = $this->journal->hostInstructionsOf('shell');

        $this->journal->asSystem(new NotifyHostInstructionCommand(
            $this->journal->hostCalled('Mac')->hostId,
            $open->id,
            $this->refusedAnswerTo($open->id),
        ));

        $process = $this->journal->hostProcessCalled('shell');
        $this->journal->assertResult(
            [HostProcessStatus::Lost, 'the host refused to open it (guard_moved), the rows moved on before the keys were sent'],
            [$process->status, $process->exit_evidence],
        );
    }

    public function test_the_start_whose_process_the_host_refused_to_open_ends_refused_with_the_hosts_reason(): void
    {
        $this->chooseActiveAccounts();
        $this->journal->owner()->showDriverArrangements()->idleAgent('Driven');
        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven
            ->openRuntime('Mac', base_path(), driverType: DriverType::Terminal));
        $opened = $this->journal->openedRuntimeOf('Driven');
        $this->journal->host('Mac', fn (TestEnrolledHost $mac) => $mac
            ->openProcessForStart('agent', $opened->sessionId));
        [$open] = $this->journal->hostInstructionsOf('agent');

        $this->journal->asSystem(new NotifyHostInstructionCommand(
            $this->journal->hostCalled('Mac')->hostId,
            $open->id,
            $this->refusedAnswerTo($open->id),
        ));

        $start = $this->journal->startOfSession($opened->sessionId);
        $this->journal->assertResult(
            [SessionProcessStatus::Stopped, 'the host refused to open it (guard_moved), the rows moved on before the keys were sent'],
            [$start->status, $start->refusal],
        );
    }

    public function test_an_image_fault_whose_facts_the_protocol_does_not_know_is_refused(): void
    {
        [$open] = $this->journal->hostInstructionsOf('shell');
        $faults = array_filter(
            $this->journal->recordedHostAnswers('claude-code', 'probe-image-missing'),
            fn (array $answer) => ($answer['refusal'] ?? null) === 'image_fault',
        );
        $fault = array_values($faults)[0];
        $fault['instruction_id'] = $open->id;
        $fault['facts']['fault'] = 'image_gone';

        $this->journal->assertRefused(HostCallUnreadable::class, fn () => $this->journal->asSystem(
            new NotifyHostInstructionCommand($this->journal->hostCalled('Mac')->hostId, $open->id, json_encode($fault)),
        ));
    }

    public function test_an_answer_to_another_hosts_instruction_is_refused(): void
    {
        [$open] = $this->journal->hostInstructionsOf('shell');
        $answer = new NotifyHostInstructionCommand($this->journal->hostCalled('Other')->hostId, $open->id, $this->refusedAnswerTo($open->id));

        $this->journal->assertRefused(HostProtocolRefused::class, fn () => $this->journal->asSystem($answer));
    }

    /**
     * The host's answer refusing the instruction because the rows it was guarded by moved on, in its own words.
     */
    private function refusedAnswerTo(string $instructionId): string
    {
        return json_encode([
            'instruction_id' => $instructionId,
            'status' => 'refused',
            'refusal' => 'guard_moved',
            'reason' => 'the rows moved on before the keys were sent',
            'facts' => ['row_hash' => 'abc'],
        ], JSON_THROW_ON_ERROR);
    }
}
