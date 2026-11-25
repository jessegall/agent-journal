<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Contracts\Drivers\DriverCatalogue;
use App\Contracts\Sessions\SessionRequestResolver;
use App\Enums\Agents\ConversationModeType;
use App\Enums\Drivers\DriverType;
use App\Enums\Profiles\ModelTier;
use App\Enums\Sessions\ModelSelectionType;
use App\Enums\Sessions\StartDisposition;
use App\Enums\Sessions\StartOriginType;
use App\Exceptions\SessionRequestMissing;
use App\Exceptions\SessionSelectionFixed;
use App\Exceptions\StartRequestConflict;
use App\Models\Agents\Agent;
use App\Models\Sessions\SessionRequest;
use App\Support\ActorIdentity;
use App\Support\DefaultDrivers;
use App\Support\RecordIdentity;
use App\Support\StartSessions;
use App\Values\ModelSelection;
use App\Values\ProfileDefaults;
use App\Values\SelectedDriver;
use App\Values\StartPolicy;
use App\Values\StartRequest;
use Illuminate\Support\Facades\Schema;
use PhpOption\None;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * A session keeps the selection it was started with and its request id; a start record is one per request id, a
 * changed repeat is a conflict, and an agent reads only its own records.
 */
final class SessionRequestTest extends TestCase
{
    use RefreshHookDatabase;

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
        $this->assertTrue(Schema::hasColumns('session_requests', [
            'request_id',
            'agent_id',
            'actor_type',
            'actor_id',
            'driver_key',
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
        ]));
    }

    public function test_a_session_shows_the_requested_default_apart_from_the_resolved_model(): void
    {
        $selection = SelectedDriver::resolve(
            null,
            ModelSelection::fromInput('default'),
            new ProfileDefaults('journal-researcher', 4, DefaultDrivers::CLAUDE_CODE, ModelTier::General, DriverType::Headless),
            null,
            $this->app->make(DriverCatalogue::class),
        );
        $requestId = TestSelections::requestId();

        $session = $this->app->make(StartSessions::class)->start(
            $this->agent('Researcher'),
            $selection,
            $requestId,
        )->session->refresh();

        $this->assertSame(
            [ModelSelectionType::ProfileDefault, null, 'sonnet', $requestId],
            [$session->requested_model_type, $session->requested_model, $session->model, $session->start_request_id],
        );
        $this->assertSame(
            [DefaultDrivers::CLAUDE_CODE, 'sonnet', 'journal-researcher', 4],
            [
                $session->selection->driver,
                $session->selection->model,
                $session->selection->source->profileKey,
                $session->selection->source->profileRevision,
            ],
        );
        $this->assertSame(ModelSelectionType::ProfileDefault, $session->selection->requested->type);
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

        $first = SessionRequest::create($request, TestSelections::pinOf($request), $requester, None::create());
        $again = SessionRequest::create($request, TestSelections::pinOf($request), $requester, None::create());

        $this->assertSame($first->id, $again->id);
        $this->assertSame(1, SessionRequest::query()->where('request_id', $request->requestId)->count());
        $this->assertSame(StartDisposition::Accepted, $again->disposition);
        $pin = TestSelections::pinOf($request);
        $this->assertSame(
            [(string) $pin->registration->key, $pin->registration->family, $pin->registration->label, $pin->catalogueRevision],
            [$first->driver_key, $first->family, $first->driver_label, $first->catalogue_revision],
        );

        $this->expectException(StartRequestConflict::class);

        $changed = $this->request($agent, $request->requestId, ModelSelection::named('claude-sonnet-5-5'));

        SessionRequest::create($changed, TestSelections::pinOf($changed), $requester, None::create());
    }

    public function test_an_agent_reads_its_own_record_and_not_another_agents(): void
    {
        $own = $this->agent('Own');
        $other = $this->agent('Other');
        $ownerWork = new RecordIdentity('helpers.helper-job', TestIds::of(7));
        $ownRequest = $this->request(
            $own,
            TestSelections::requestId(),
            ModelSelection::named('claude-opus-5-5'),
            $ownerWork,
        );
        $otherRequest = $this->request($other, TestSelections::requestId(), ModelSelection::named('claude-opus-5-5'));
        SessionRequest::create($ownRequest, TestSelections::pinOf($ownRequest), ActorIdentity::system(), None::create());
        SessionRequest::create($otherRequest, TestSelections::pinOf($otherRequest), ActorIdentity::system(), None::create());
        $session = $this->app->make(StartSessions::class)
            ->start($own, TestSelections::of(), TestSelections::requestId())
            ->session;
        $this->journal->actAsAgentIds($own->id, $session->id);
        $resolver = $this->app->make(SessionRequestResolver::class);

        $this->assertSame($own->id, $resolver->own($ownRequest->requestId)->agentId);
        $this->assertSame(
            [$ownRequest->requestId],
            array_map(fn ($record) => $record->requestId, $resolver->forOwnerReference($ownerWork->reference())),
        );

        $this->expectException(SessionRequestMissing::class);

        $resolver->own($otherRequest->requestId);
    }

    private function agent(string $name): Agent
    {
        return Agent::create($name, 'main-agent', $this->localProject());
    }

    private function request(
        Agent $agent,
        string $requestId,
        ModelSelection $model,
        RecordIdentity|null $owner = null,
    ): StartRequest {
        $origin = $owner === null ? StartOriginType::MainStart : StartOriginType::OwnerRequest;

        return new StartRequest(
            $requestId,
            $agent->id,
            SelectedDriver::resolve('claude-code', $model, null, null, $this->app->make(DriverCatalogue::class)),
            $origin,
            $owner,
            null,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile(TestSelections::onHost()),
            driverType: DriverType::Headless,
        );
    }
}
