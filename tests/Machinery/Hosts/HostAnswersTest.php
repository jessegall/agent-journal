<?php

declare(strict_types=1);

namespace Tests\Machinery\Hosts;

use App\Hosts\Commands\NotifyHostInstruction\NotifyHostInstructionCommand;
use App\Hosts\Commands\StopHostProcess\StopHostProcessCommand;
use App\Hosts\Enums\HostInstructionStatus;
use App\Hosts\Exceptions\HostAnswerAwaitedInTransaction;
use App\Hosts\HostAnswers;
use App\Hosts\Protocol\HostProcessType;
use App\Values\HostInstructionSource;
use Illuminate\Database\DatabaseManager;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\Hosts\TestEnrolledHost;
use Tests\TestCase;

/**
 * The answer to an instruction is read once the host gave it, after the command that made the instruction committed; an instruction
 * left unanswered is handed back open once the wait ends, and a wait inside a transaction is refused.
 */
#[TestsMachinery(HostAnswers::class)]
final class HostAnswersTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'hosts',
        'host_processes',
        'host_instructions',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->enrollHost('Mac', [base_path()])->host('Mac', fn (TestEnrolledHost $mac) => $mac
            ->openProcess('pipe', HostProcessType::Pipe));
    }

    public function test_an_answered_stop_is_read_and_an_unanswered_one_comes_back_open(): void
    {
        $answers = $this->journal->service(HostAnswers::class);
        $answered = $this->stop();
        $hostId = $this->journal->hostCalled('Mac')->hostId;
        $this->journal->asSystem(new NotifyHostInstructionCommand(
            $hostId,
            $answered,
            json_encode(['instruction_id' => $answered, 'status' => 'done'], JSON_THROW_ON_ERROR),
        ));

        $unanswered = $this->stop();

        $this->journal->assertResult(
            [[
                HostInstructionStatus::Done,
                [],
            ], HostInstructionStatus::Pending],
            [
                [
                    $answers->await($answered, 1000)->status,
                    $answers->await($answered, 1000)->answer->facts,
                ],
                $answers->await($unanswered, 50)->status,
            ],
        );
    }

    public function test_a_wait_inside_a_transaction_is_refused(): void
    {
        $instruction = $this->stop();

        $this->journal->assertRefused(
            HostAnswerAwaitedInTransaction::class,
            fn () => $this->journal->service(DatabaseManager::class)->connection()->transaction(
                fn () => $this->journal->service(HostAnswers::class)->await($instruction, 50),
            ),
        );
    }

    private function stop(): string
    {
        $process = $this->journal->hostProcessCalled('pipe')->id;

        return $this->journal->asSystem(new StopHostProcessCommand(
            $process,
            1000,
            1000,
            HostInstructionSource::fromJournal(),
        ));
    }
}
