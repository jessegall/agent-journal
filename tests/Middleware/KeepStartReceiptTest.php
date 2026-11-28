<?php

declare(strict_types=1);

namespace Tests\Middleware;

use App\CommandMiddleware\KeepStartReceipt;
use App\Exceptions\ImageUnverified;
use App\Exceptions\StartRefusalReplayed;
use App\Exceptions\StartRequestConflict;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Sessions\SessionRequest;
use App\Sessions\Contracts\SessionRequestResolver;
use App\Sessions\Enums\StartDisposition;
use App\Sessions\Enums\StartRefusalType;
use App\Sessions\Exceptions\SessionRequestMissing;
use App\Support\ActorReference;
use App\Support\RecordIdentity;
use PhpOption\None;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\Agents\StartsAgents;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsMiddleware;
use Tests\TestCase;

/**
 * Around a start's transaction, one request id at a time: a refusal is kept on the start's record once its
 * transaction rolled back, so a replay answers it without a second admission and changed input under the id
 * conflicts; an intent interrupted before its receipt resumes once, and only its requester reads a refused receipt.
 */
#[TestsMiddleware(KeepStartReceipt::class)]
final class KeepStartReceiptTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgents;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'accounts',
        'active_accounts',
        'session_requests',
        'session_processes',
        'session_policies',
        'session_tokens',
        'agent_runtimes',
        'driver_requests',
        'agent_stacks',
        'links',
        'command_receipts',
        'settings_records',
        'account_notices',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->prepareAgentStarts();
    }

    public function test_a_refused_start_keeps_its_receipt_after_the_rollback(): void
    {
        $this->proveTheHost();

        $this->images->refuseEvery();
        $request = $this->containerRequest(TestSelections::requestId());

        $this->assertThrows(fn () => $this->start($request), ImageUnverified::class);

        $record = SessionRequest::query()->where('request_id', $request->requestId)->sole();
        $this->assertSame(
            [StartDisposition::Refused, StartRefusalType::ImageUnverified->value, null],
            [$record->disposition, $record->refusal_reason, $record->session_id],
        );
        $this->assertNotNull($record->refused_at);
        $this->assertSame(0, AgentSession::query()->where('agent_id', $this->agentId)->count());
    }

    public function test_a_replay_answers_the_kept_refusal_without_a_second_admission(): void
    {
        $this->proveTheHost();

        $this->images->refuseEvery();
        $request = $this->containerRequest(TestSelections::requestId());
        $this->assertThrows(fn () => $this->start($request), ImageUnverified::class);
        $checksAtRefusal = $this->images->checks;
        $this->images->verifyEvery();

        try {
            $this->start($request);
            $this->fail('A refused start ran again under its request id.');
        } catch (StartRefusalReplayed $replayed) {
            $this->assertSame(StartRefusalType::ImageUnverified->value, $replayed->reason);
        }

        $this->assertSame($checksAtRefusal, $this->images->checks);
        $this->assertSame(0, AgentSession::query()->where('agent_id', $this->agentId)->count());
    }

    public function test_changed_input_under_a_refused_key_is_refused_as_a_conflict(): void
    {
        $this->proveTheHost();

        $this->images->refuseEvery();
        $request = $this->containerRequest(TestSelections::requestId());
        $this->assertThrows(fn () => $this->start($request), ImageUnverified::class);

        $this->assertThrows(
            fn () => $this->start(
                $this->containerRequest(
                    $request->requestId,
                    new RecordIdentity('tests.owner', '01m7wgahp0n7766x1e1ta8ehex'),
                ),
            ),
            StartRequestConflict::class,
        );
        $this->assertSame(
            StartDisposition::Refused,
            SessionRequest::query()->where('request_id', $request->requestId)->sole()->disposition,
        );
    }

    public function test_an_intent_interrupted_before_its_receipt_resumes_once(): void
    {
        $this->proveTheHost();

        $this->images->verifyEvery();
        $request = $this->containerRequest(TestSelections::requestId());
        SessionRequest::create(
            $request,
            TestSelections::pinOf($request),
            ActorReference::forUser($this->journal->ownerUser()->id),
            None::create(),
        );

        $resumed = $this->start($request);
        $replayed = $this->start($request);

        $record = SessionRequest::query()->where('request_id', $request->requestId)->sole();
        $this->assertSame(
            [StartDisposition::Started, $resumed->sessionId, $resumed->sessionId, true, false],
            [
                $record->disposition,
                $record->session_id,
                $replayed->sessionId,
                $resumed->isNewSession,
                $replayed->isNewSession,
            ],
        );
        $this->assertSame(1, AgentSession::query()->where('agent_id', $this->agentId)->count());
    }

    public function test_the_requester_reads_a_sessionless_refused_receipt_and_another_agent_finds_none(): void
    {
        $this->proveTheHost();

        $this->images->refuseEvery();
        $request = $this->containerRequest(TestSelections::requestId());
        $this->assertThrows(fn () => $this->start($request), ImageUnverified::class);

        $receipt = $this->app->make(SessionRequestResolver::class)->receipt($request->requestId);

        $this->assertSame(
            [StartDisposition::Refused, StartRefusalType::ImageUnverified->value, null],
            [$receipt->disposition, $receipt->refusalReason, $receipt->sessionId],
        );
        $reader = Agent::create('Reader', 'writing-helper', $this->localProject());
        $this->journal->actAsAgentIds($reader->id, TestSelections::requestId());
        $this->assertThrows(
            fn () => $this->app->make(SessionRequestResolver::class)->receipt($request->requestId),
            SessionRequestMissing::class,
        );
    }
}
