<?php

declare(strict_types=1);

namespace Tests\Feature\AgentRequests;

use App\Api\Processes\AdmissionAlreadyStarted;
use App\Api\Processes\ProcessApi;
use App\Api\Processes\RunChunk;
use App\Api\Processes\RunPart;
use App\Api\Processes\StartableAdmission;
use App\Contracts\Admission\ShellAdmission;
use App\Enums\Processes\OutputStream;
use App\Enums\Processes\ShellDialect;
use App\Enums\Runs\RunEventType;
use App\Exceptions\CallKeyConflict;
use App\Exceptions\CallKeyExpired;
use App\Support\CallKey;
use App\Support\ExpiredReceipts;
use App\Values\ExecutionContext;
use App\Values\RunEvent;
use Carbon\CarbonImmutable;
use Domain\Memory\Api\MemoryApi;
use Domain\Memory\MemoryDomain;
use Domain\Memory\Models\Memory;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\DomainBoot;
use Tests\Support\Processes\ProcessOutputDisk;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A write sent again gets its first answer and is made once, a key reused for another write or kept past its time is
 * refused with what to do, a lost admission answer asked again starts the run once, and a piece of output sent twice
 * is stored once, all through the real client and server.
 */
final class CallRecoveryTest extends TestCase
{
    use RefreshHookDatabase;

    private const string RECORD_ADVICE = 'Check the record';

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(MemoryDomain::class);
    }

    private TestStart $start;

    protected function setUp(): void
    {
        parent::setUp();

        ProcessOutputDisk::fake();
        config(['processes.runner' => true]);
        $this->start = TestStart::start();
        $this->journal->relayAgentCommands($this->start);
    }

    public function test_a_keyed_write_sent_again_answers_its_first_result_and_writes_once(): void
    {
        $memories = $this->app->make(MemoryApi::class);
        $key = new CallKey('save-once');

        $first = $memories->saveMemory('Ship the client.', 5, $key);
        $again = $memories->saveMemory('Ship the client.', 5, $key);

        $this->assertSame($first->memoryId, $again->memoryId);
        $this->assertSame(1, Memory::query()->withoutGlobalScopes()->count());
    }

    public function test_one_key_for_another_write_is_a_conflict(): void
    {
        $memories = $this->app->make(MemoryApi::class);
        $memories->saveMemory('First.', 5, new CallKey('one-key'));

        $this->expectException(CallKeyConflict::class);

        $memories->saveMemory('Second.', 5, new CallKey('one-key'));
    }

    public function test_a_key_past_its_time_is_refused_with_advice_to_check_the_record(): void
    {
        $memories = $this->app->make(MemoryApi::class);
        $memories->saveMemory('Kept a while.', 5, new CallKey('old-key'));
        $this->app->make(ExpiredReceipts::class)->expirePastRetention(CarbonImmutable::now()->addYears(2));

        try {
            $memories->saveMemory('Kept a while.', 5, new CallKey('old-key'));
            $this->fail('The expired key was not refused.');
        } catch (CallKeyExpired $expired) {
            $this->assertStringContainsString(self::RECORD_ADVICE, implode("\n", $expired->consoleLines()));
        }

        $this->assertSame(1, Memory::query()->withoutGlobalScopes()->count());
    }

    public function test_a_lost_admission_answer_asked_again_starts_the_run_once_and_a_new_key_finds_it_started(): void
    {
        $processes = $this->app->make(ProcessApi::class);
        $runId = $this->admitted('printf recovered');

        $first = $processes->fetchAdmission($runId, new CallKey('fetch-1'));
        $again = $processes->fetchAdmission($runId, new CallKey('fetch-1'));
        $other = $processes->fetchAdmission($runId, new CallKey('fetch-2'));

        $this->assertInstanceOf(StartableAdmission::class, $first);
        $this->assertInstanceOf(StartableAdmission::class, $again);
        $this->assertSame($first->eventKey, $again->eventKey);
        $this->assertInstanceOf(AdmissionAlreadyStarted::class, $other);
    }

    public function test_a_piece_of_output_sent_twice_is_stored_once(): void
    {
        $processes = $this->app->make(ProcessApi::class);
        $runId = $this->admitted('printf piece');
        $admission = $processes->fetchAdmission($runId, new CallKey('fetch-piece'));
        $this->assertInstanceOf(StartableAdmission::class, $admission);
        $part = new RunPart(1, 1, 'printf');
        $queued = new RunEvent(1, RunEventType::PartQueued, $part);
        $processes->recordRunEvents($runId, $admission->eventKey, [$queued]);
        $chunk = new RunChunk($part, OutputStream::Stdout, 0, base64_encode('piece'));

        $first = $processes->recordRunChunk($runId, $admission->eventKey, $chunk);
        $again = $processes->recordRunChunk($runId, $admission->eventKey, $chunk);

        $this->assertSame(5, $first->stored);
        $this->assertSame(5, $again->stored);
    }

    private function admitted(string $line): string
    {
        $this->start->startRequest($this->app);
        $context = ExecutionContext::inFolder(base_path());
        $requestKey = bin2hex(random_bytes(8));
        $admission = $this->app->make(ShellAdmission::class)->admit($line, ShellDialect::Bash, $context, $requestKey);

        return (string) $admission->runId;
    }
}
