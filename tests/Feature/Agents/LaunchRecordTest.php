<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Actors\Support\ActorIdentity;
use App\Agents\Actions\LaunchSessions;
use App\Agents\Contracts\LaunchRecordReader;
use App\Agents\Enums\AgentRole;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\LaunchDisposition;
use App\Agents\Enums\LaunchOriginType;
use App\Agents\Enums\ModelSelectionType;
use App\Agents\Exceptions\LaunchRecordMissing;
use App\Agents\Exceptions\LaunchRequestConflict;
use App\Agents\Exceptions\SessionSelectionFixed;
use App\Agents\Models\Agent;
use App\Agents\Models\LaunchRecord;
use App\Agents\Support\LaunchRequest;
use App\Agents\Support\ModelSelection;
use App\Agents\Support\ProfileDefaults;
use App\Agents\Support\SelectedProgram;
use App\Programs\Enums\HookProgram;
use Illuminate\Support\Facades\Schema;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * A session keeps the selection it was launched with and its request id; a launch record is one per request id, a
 * changed repeat is a conflict, and an agent reads only its own records.
 */
final class LaunchRecordTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

    public function test_both_tables_have_the_selection_and_request_columns(): void
    {
        $this->assertTrue(Schema::hasColumns('agent_sessions', ['model', 'requested_model_type', 'requested_model', 'program_source', 'profile_key', 'profile_revision', 'launch_request_id']));
        $this->assertTrue(Schema::hasColumns('launch_records', ['request_id', 'agent_id', 'actor_type', 'actor_id', 'program', 'model', 'requested_model_type', 'requested_model', 'program_source', 'profile_key', 'profile_revision', 'origin_type', 'owner_reference', 'context_reference', 'conversation_mode', 'payload_digest', 'disposition', 'session_id']));
    }

    public function test_a_session_shows_the_requested_default_apart_from_the_resolved_model(): void
    {
        $selection = SelectedProgram::resolve(null, ModelSelection::fromInput('default'), new ProfileDefaults('journal-researcher', 4, HookProgram::ClaudeCode, false, 'claude-sonnet-5-5', []), null);
        $requestId = TestSelections::requestId();

        $session = $this->app->make(LaunchSessions::class)->launch($this->agent('Researcher'), $selection, $requestId)->session->refresh();

        $this->assertSame([ModelSelectionType::ProfileDefault, null, 'claude-sonnet-5-5', $requestId], [$session->requested_model_type, $session->requested_model, $session->model, $session->launch_request_id]);
        $this->assertSame([HookProgram::ClaudeCode, 'claude-sonnet-5-5', 'journal-researcher', 4], [$session->selection()->program, $session->selection()->model, $session->selection()->source->profileKey, $session->selection()->source->profileRevision]);
        $this->assertSame(ModelSelectionType::ProfileDefault, $session->selection()->requested->type);
    }

    public function test_a_session_never_takes_a_second_selection(): void
    {
        $session = $this->app->make(LaunchSessions::class)->launch($this->agent('Builder'), TestSelections::of(), TestSelections::requestId())->session;

        $this->expectException(SessionSelectionFixed::class);

        $session->useSelection(TestSelections::of('codex'), TestSelections::requestId());
    }

    public function test_one_request_id_keeps_one_record_and_a_changed_repeat_is_a_conflict(): void
    {
        $agent = $this->agent('Builder');
        $request = $this->request($agent, TestSelections::requestId(), ModelSelection::named('claude-opus-5-5'));
        $requester = ActorIdentity::system();

        $first = LaunchRecord::accept($request, $requester);
        $again = LaunchRecord::accept($request, $requester);

        $this->assertSame($first->id, $again->id);
        $this->assertSame(1, LaunchRecord::query()->where('request_id', $request->requestId)->count());
        $this->assertSame(LaunchDisposition::Accepted, $again->disposition);

        $this->expectException(LaunchRequestConflict::class);

        LaunchRecord::accept($this->request($agent, $request->requestId, ModelSelection::named('claude-sonnet-5-5')), $requester);
    }

    public function test_an_agent_reads_its_own_record_and_not_another_agents(): void
    {
        $own = $this->agent('Own');
        $other = $this->agent('Other');
        $ownRequest = $this->request($own, TestSelections::requestId(), ModelSelection::named('claude-opus-5-5'), 'helpers.job 7');
        $otherRequest = $this->request($other, TestSelections::requestId(), ModelSelection::named('claude-opus-5-5'));
        LaunchRecord::accept($ownRequest, ActorIdentity::system());
        LaunchRecord::accept($otherRequest, ActorIdentity::system());
        $session = $this->app->make(LaunchSessions::class)->launch($own, TestSelections::of(), TestSelections::requestId())->session;
        $this->startRequestAs($own->id, $session->id);
        $reader = $this->app->make(LaunchRecordReader::class);

        $this->assertSame($own->id, $reader->own($ownRequest->requestId)->agentId);
        $this->assertSame([$ownRequest->requestId], array_map(fn ($record) => $record->requestId, $reader->forOwnerReference('helpers.job 7')));

        $this->expectException(LaunchRecordMissing::class);

        $reader->own($otherRequest->requestId);
    }

    private function agent(string $name): Agent
    {
        return Agent::named($name, AgentRole::MainAgent);
    }

    private function request(Agent $agent, string $requestId, ModelSelection $model, string|null $owner = null): LaunchRequest
    {
        $origin = $owner === null ? LaunchOriginType::MainLaunch : LaunchOriginType::OwnerRequest;

        return new LaunchRequest($requestId, $agent->id, SelectedProgram::resolve('claude-code', $model, null, null), $origin, $owner, null, ConversationModeType::New, null, TestSelections::onHost());
    }
}
