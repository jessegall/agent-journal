<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Agents\Commands\LaunchAgent;
use App\Agents\Commands\RetireAgent;
use App\Agents\Contracts\LaunchMaterialReader;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\LaunchDisposition;
use App\Agents\Enums\LaunchOriginType;
use App\Agents\Events\LaunchAccepted;
use App\Agents\Exceptions\AgentBusy;
use App\Agents\Exceptions\LaunchRefused;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Models\LaunchRecord;
use App\Agents\Support\LaunchReceipt;
use App\Agents\Support\LaunchRequest;
use App\Bus\Contracts\CommandBus;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * Every Core launch runs LaunchAgent: one session per request id, refused for a retired or busy agent, and a receipt
 * that never carries the launch token, which only the host's own read gives.
 */
final class LaunchAgentTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

    private Agent $agent;

    protected function setUp(): void
    {
        parent::setUp();

        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->startUserRequestAs($owner->id);
        $this->agent = Agent::query()->create(['name' => 'Researcher', 'role' => 'hooks.read_only_helper_ready']);
    }

    public function test_a_session_without_a_selection_cannot_be_written(): void
    {
        $this->expectException(QueryException::class);

        DB::table('agent_sessions')->insert(['id' => (string) Str::ulid(), 'agent_id' => $this->agent->id, 'program' => 'claude-code', 'status' => 'active']);
    }

    public function test_repeating_a_request_id_returns_the_same_session(): void
    {
        $request = $this->request();

        $first = $this->launch($request);
        $again = $this->launch($request);

        $this->assertSame([$first->sessionId, true, false], [$again->sessionId, $first->newSession, $again->newSession]);
        $this->assertSame(1, AgentSession::query()->where('agent_id', $this->agent->id)->count());
        $this->assertSame(LaunchDisposition::Launched, LaunchRecord::query()->where('request_id', $request->requestId)->sole()->disposition);
        $this->assertSame(['--model', TestSelections::MODEL], $first->programArguments);
        $this->assertSame(LaunchReceipt::ACTUAL_MODEL_NOT_REPORTED, $first->actualModel);
    }

    public function test_a_retired_agent_is_refused_and_a_busy_agent_refuses_a_second_launch(): void
    {
        $this->launch($this->request());

        $this->assertThrows(fn () => $this->launch($this->request()), AgentBusy::class);

        $this->app->make(CommandBus::class)->run(new RetireAgent($this->agent->id));

        $this->assertThrows(fn () => $this->launch($this->request()), LaunchRefused::class);
    }

    public function test_the_receipt_holds_no_token_and_the_host_reads_it_once_the_launch_is_accepted(): void
    {
        Event::fake([LaunchAccepted::class]);
        $request = $this->request();

        $receipt = $this->launch($request);
        $material = $this->app->make(LaunchMaterialReader::class)->material($request->requestId);

        $this->assertSame($receipt->sessionId, $material->sessionId);
        $this->assertStringNotContainsString($material->token, serialize($receipt));
        $this->assertStringNotContainsString($material->token, json_encode($receipt, JSON_THROW_ON_ERROR));
        Event::assertDispatched(LaunchAccepted::class, fn (LaunchAccepted $accepted): bool => $accepted->sessionId === $receipt->sessionId);
    }

    public function test_a_codex_launch_receipt_carries_its_model_flag_and_no_actual_model(): void
    {
        $request = new LaunchRequest(TestSelections::requestId(), $this->agent->id, TestSelections::of('codex'), LaunchOriginType::MainLaunch, null, null, ConversationModeType::New, null);

        $receipt = $this->launch($request);

        $this->assertSame([['--model', TestSelections::MODEL], LaunchReceipt::ACTUAL_MODEL_NOT_REPORTED], [$receipt->programArguments, $receipt->actualModel]);
    }

    private function request(): LaunchRequest
    {
        return new LaunchRequest(TestSelections::requestId(), $this->agent->id, TestSelections::of(), LaunchOriginType::MainLaunch, null, null, ConversationModeType::New, null);
    }

    private function launch(LaunchRequest $request): LaunchReceipt
    {
        return $this->app->make(CommandBus::class)->run(new LaunchAgent($request));
    }
}
