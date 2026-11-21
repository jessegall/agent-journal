<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Actors\Support\ActorIdentity;
use App\Agents\Actions\StartSessions;
use App\Agents\Contracts\StartRecordResolver;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\ModelSelectionType;
use App\Agents\Enums\StartDisposition;
use App\Agents\Enums\StartOriginType;
use App\Agents\Exceptions\SessionSelectionFixed;
use App\Agents\Exceptions\StartRecordMissing;
use App\Agents\Exceptions\StartRequestConflict;
use App\Agents\Models\Agent;
use App\Agents\Models\StartRecord;
use App\Agents\Values\ModelSelection;
use App\Agents\Values\ProfileDefaults;
use App\Agents\Values\SelectedDriver;
use App\Agents\Values\StartPolicy;
use App\Agents\Values\StartRequest;
use App\Drivers\Enums\HookDriver;
use Illuminate\Support\Facades\Schema;
use PhpOption\None;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * A session keeps the selection it was started with and its request id; a start record is one per request id, a
 * changed repeat is a conflict, and an agent reads only its own records.
 */
final class StartRecordTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

    public function test_both_tables_have_the_selection_and_request_columns(): void
    {
        $this->assertTrue(Schema::hasColumns('agent_sessions', [
            'model',
            'requested_model_type',
            'requested_model',
            'driver_source',
            'profile_key',
            'profile_revision',
            'start_request_id',
        ]));
        $this->assertTrue(Schema::hasColumns('start_records', [
            'request_id',
            'agent_id',
            'actor_type',
            'actor_id',
            'driver',
            'model',
            'requested_model_type',
            'requested_model',
            'driver_source',
            'profile_key',
            'profile_revision',
            'origin_type',
            'owner_reference',
            'context_reference',
            'conversation_mode',
            'payload_digest',
            'disposition',
            'session_id',
            'reply_inbox_id',
        ]));
    }

    public function test_a_session_shows_the_requested_default_apart_from_the_resolved_model(): void
    {
        $selection = SelectedDriver::resolve(
            null,
            ModelSelection::fromInput('default'),
            new ProfileDefaults('journal-researcher', 4, HookDriver::ClaudeCode, false, 'claude-sonnet-5-5', []),
            null,
        );
        $requestId = TestSelections::requestId();

        $session = $this->app->make(StartSessions::class)->start(
            $this->agent('Researcher'),
            $selection,
            $requestId,
        )->session->refresh();

        $this->assertSame(
            [ModelSelectionType::ProfileDefault, null, 'claude-sonnet-5-5', $requestId],
            [$session->requested_model_type, $session->requested_model, $session->model, $session->start_request_id],
        );
        $this->assertSame(
            [HookDriver::ClaudeCode, 'claude-sonnet-5-5', 'journal-researcher', 4],
            [
                $session->selection()->driver,
                $session->selection()->model,
                $session->selection()->source->profileKey,
                $session->selection()->source->profileRevision,
            ],
        );
        $this->assertSame(ModelSelectionType::ProfileDefault, $session->selection()->requested->type);
    }

    public function test_a_session_never_takes_a_second_selection(): void
    {
        $session = $this->app->make(StartSessions::class)->start(
            $this->agent('Builder'),
            TestSelections::of(),
            TestSelections::requestId(),
        )->session;

        $this->expectException(SessionSelectionFixed::class);

        $session->useSelection(TestSelections::of('codex'), TestSelections::requestId());
    }

    public function test_one_request_id_keeps_one_record_and_a_changed_repeat_is_a_conflict(): void
    {
        $agent = $this->agent('Builder');
        $request = $this->request($agent, TestSelections::requestId(), ModelSelection::named('claude-opus-5-5'));
        $requester = ActorIdentity::system();

        $first = StartRecord::accept($request, $requester, None::create());
        $again = StartRecord::accept($request, $requester, None::create());

        $this->assertSame($first->id, $again->id);
        $this->assertSame(1, StartRecord::query()->where('request_id', $request->requestId)->count());
        $this->assertSame(StartDisposition::Accepted, $again->disposition);

        $this->expectException(StartRequestConflict::class);

        $changed = $this->request($agent, $request->requestId, ModelSelection::named('claude-sonnet-5-5'));

        StartRecord::accept($changed, $requester, None::create());
    }

    public function test_an_agent_reads_its_own_record_and_not_another_agents(): void
    {
        $own = $this->agent('Own');
        $other = $this->agent('Other');
        $ownRequest = $this->request(
            $own,
            TestSelections::requestId(),
            ModelSelection::named('claude-opus-5-5'),
            'helpers.job 7',
        );
        $otherRequest = $this->request($other, TestSelections::requestId(), ModelSelection::named('claude-opus-5-5'));
        StartRecord::accept($ownRequest, ActorIdentity::system(), None::create());
        StartRecord::accept($otherRequest, ActorIdentity::system(), None::create());
        $session = $this->app->make(StartSessions::class)
            ->start($own, TestSelections::of(), TestSelections::requestId())
            ->session;
        $this->startRequestAs($own->id, $session->id);
        $resolver = $this->app->make(StartRecordResolver::class);

        $this->assertSame($own->id, $resolver->own($ownRequest->requestId)->agentId);
        $this->assertSame(
            [$ownRequest->requestId],
            array_map(fn ($record) => $record->requestId, $resolver->forOwnerReference('helpers.job 7')),
        );

        $this->expectException(StartRecordMissing::class);

        $resolver->own($otherRequest->requestId);
    }

    private function agent(string $name): Agent
    {
        return Agent::create($name, 'main-agent');
    }

    private function request(
        Agent $agent,
        string $requestId,
        ModelSelection $model,
        string|null $owner = null,
    ): StartRequest {
        $origin = $owner === null ? StartOriginType::MainStart : StartOriginType::OwnerRequest;

        return new StartRequest(
            $requestId,
            $agent->id,
            SelectedDriver::resolve('claude-code', $model, null, null),
            $origin,
            $owner,
            null,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile(TestSelections::onHost()),
        );
    }
}
