<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Commands\Hosts\NotifyHostOrder\NotifyHostOrderCommand;
use App\Enums\Hosts\HostOrderStatus;
use App\Enums\Hosts\HostProcessStatus;
use App\Enums\Hosts\HostRefusal;
use App\Exceptions\HostProtocolRefused;
use App\Support\Hosts\ProcessFeed;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A host's answer is stored on its order with its facts, the process's worker hears of it, and an answer to another
 * host's order is refused.
 */
#[TestsCommand(NotifyHostOrderCommand::class)]
final class NotifyHostOrderTest extends TestCase
{
    use RefreshHookDatabase;

    private const string REFUSED = '{"status":"refused","refusal":"guard_moved","facts":{"row_hash":"abc"}}';

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->enrollHost('Mac', [base_path()])->enrollHost('Other', [base_path()])->openHostProcess('Mac', 'shell');
    }

    public function test_a_refused_answer_is_stored_with_its_facts_and_its_worker_is_woken(): void
    {
        [$open] = $this->journal->hostOrdersOf('shell');

        $this->journal->asSystem(new NotifyHostOrderCommand($this->journal->hostCalled('Mac')->hostId, $open->id, self::REFUSED));

        $open->refresh();
        $heard = $this->journal->service(ProcessFeed::class)->after($open->host_process_id, ProcessFeed::FIRST_CURSOR, 0);
        $this->journal->assertResult(
            [HostOrderStatus::Refused, HostRefusal::GuardMoved, ['row_hash' => 'abc'], $open->id],
            [$open->status, $open->refusal, $open->answer, $heard[0]->answeredOrderId],
        );
    }

    public function test_a_refused_open_order_loses_its_process_with_the_refusal_as_evidence(): void
    {
        [$open] = $this->journal->hostOrdersOf('shell');

        $this->journal->asSystem(new NotifyHostOrderCommand($this->journal->hostCalled('Mac')->hostId, $open->id, self::REFUSED));

        $process = $this->journal->hostProcessCalled('shell');
        $this->journal->assertResult(
            [HostProcessStatus::Lost, 'the host refused to open it: guard_moved'],
            [$process->status, $process->exit_evidence],
        );
    }

    public function test_an_answer_to_another_hosts_order_is_refused(): void
    {
        [$open] = $this->journal->hostOrdersOf('shell');
        $answer = new NotifyHostOrderCommand($this->journal->hostCalled('Other')->hostId, $open->id, self::REFUSED);

        $this->journal->assertRefused(HostProtocolRefused::class, fn () => $this->journal->asSystem($answer));
    }
}
