<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Agents\Commands\RetireAgent;
use App\Agents\Commands\StartAgent;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\StartDisposition;
use App\Agents\Enums\StartOriginType;
use App\Agents\Events\StartAccepted;
use App\Agents\Exceptions\AgentBusy;
use App\Agents\Exceptions\StartRefused;
use App\Agents\Models\AgentSession;
use App\Agents\Models\StartRecord;
use App\Agents\Resolvers\Support\HostStartMaterial;
use App\Agents\Support\StartPolicy;
use App\Agents\Support\StartReceipt;
use App\Agents\Support\StartRequest;
use App\Bus\Contracts\CommandBus;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\HasResearcherAgent;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsOwnerRequest;
use Tests\TestCase;

/**
 * Every Core start runs StartAgent: one session per request id, refused for a retired or busy agent, and a receipt
 * that never carries the start token, which only the host's own read gives.
 */
final class StartAgentTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsOwnerRequest;
    use HasResearcherAgent;

    public function test_a_session_without_a_selection_cannot_be_written(): void
    {
        $this->expectException(QueryException::class);

        DB::table('agent_sessions')->insert(
            [
                'id' => (string) Str::ulid(),
                'agent_id' => $this->agent->id,
                'program' => 'claude-code',
                'status' => 'active',
                'profile_key' => 'main-agent',
                'profile_revision' => 1,
            ],
        );
    }

    public function test_repeating_a_request_id_returns_the_same_session(): void
    {
        $request = $this->request();

        $first = $this->start($request);
        $again = $this->start($request);

        $this->assertSame(
            [$first->sessionId, true, false],
            [$again->sessionId, $first->newSession, $again->newSession],
        );
        $this->assertSame(1, AgentSession::query()->where('agent_id', $this->agent->id)->count());
        $this->assertSame(
            StartDisposition::Started,
            StartRecord::query()->where('request_id', $request->requestId)->sole()->disposition,
        );
        $this->assertSame(['--model', TestSelections::MODEL], $first->programArguments);
        $this->assertSame(StartReceipt::ACTUAL_MODEL_NOT_REPORTED, $first->actualModel);
    }

    public function test_a_retired_agent_is_refused_and_a_busy_agent_refuses_a_second_start(): void
    {
        $this->start($this->request());

        $this->assertThrows(fn () => $this->start($this->request()), AgentBusy::class);

        $this->app->make(CommandBus::class)->run(new RetireAgent($this->agent->id));

        $this->assertThrows(fn () => $this->start($this->request()), StartRefused::class);
    }

    public function test_the_receipt_holds_no_token_and_the_host_reads_it_once_the_start_is_accepted(): void
    {
        Event::fake([StartAccepted::class]);
        $request = $this->request();

        $receipt = $this->start($request);
        $material = $this->app->make(HostStartMaterial::class)->material($request->requestId);

        $this->assertSame($receipt->sessionId, $material->sessionId);
        $this->assertStringNotContainsString($material->token, serialize($receipt));
        $this->assertStringNotContainsString($material->token, json_encode($receipt, JSON_THROW_ON_ERROR));
        Event::assertDispatched(
            StartAccepted::class,
            fn (StartAccepted $accepted): bool => $accepted->sessionId === $receipt->sessionId,
        );
    }

    public function test_a_codex_start_receipt_carries_its_model_flag_and_no_actual_model(): void
    {
        $request = new StartRequest(
            TestSelections::requestId(),
            $this->agent->id,
            TestSelections::of('codex'),
            StartOriginType::MainStart,
            null,
            null,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile(TestSelections::onHost()),
        );

        $receipt = $this->start($request);

        $this->assertSame(
            [['--model', TestSelections::MODEL], StartReceipt::ACTUAL_MODEL_NOT_REPORTED],
            [$receipt->programArguments, $receipt->actualModel],
        );
    }

    private function request(): StartRequest
    {
        return new StartRequest(
            TestSelections::requestId(),
            $this->agent->id,
            TestSelections::of(),
            StartOriginType::MainStart,
            null,
            null,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile(TestSelections::onHost()),
        );
    }

    private function start(StartRequest $request): StartReceipt
    {
        return $this->app->make(CommandBus::class)->run(new StartAgent($request));
    }
}
