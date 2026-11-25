<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Enums\Agents\ConversationModeType;
use App\Enums\Drivers\DriverType;
use App\Enums\Sessions\CapacityResource;
use App\Enums\Sessions\StartOriginType;
use App\Exceptions\CapacityUnavailable;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Sessions\SessionRequest;
use App\Support\Access\AccessSettings;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\RecordIdentity;
use App\Support\StartSessions;
use App\Values\StartPolicy;
use App\Values\StartRequest;
use PhpOption\None;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * A browser whose start reply was lost reads the start by the request id it kept: a refused start with no session
 * answers its reason and wording, a started one its session, and another user's key answers only that it is
 * unavailable.
 */
final class StartReceiptReadTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

    private User $owner;

    private Agent $agent;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->startUserRequestAs($this->owner->id);
        $this->agent = Agent::create('Builder', 'writing-helper');
    }

    public function test_a_refused_start_without_a_session_answers_its_reason_by_key(): void
    {
        $request = $this->request();
        SessionRequest::create($request, TestSelections::pinOf($request), $this->ownerIdentity(), None::create())->refuse(
            CapacityUnavailable::because(CapacityResource::Memory, 'its memory does not fit.'),
        );

        $this->actingAs($this->owner)->getJson(route('web.start-receipt', $request->requestId))
            ->assertOk()
            ->assertExactJson([
                'requestId' => $request->requestId,
                'state' => 'refused',
                'reasonCode' => 'capacity-unavailable',
                'explanation' => 'The host lacks the required CPU, memory or disk.',
                'remedy' => 'Check capacity',
            ]);
    }

    public function test_a_started_request_answers_its_session_by_key(): void
    {
        $request = $this->request();
        $record = SessionRequest::create($request, TestSelections::pinOf($request), $this->ownerIdentity(), None::create());
        $session = $this->app->make(StartSessions::class)
            ->start($this->agent, TestSelections::of('claude-code'), $request->requestId)
            ->session;
        $record->startedAs($session);

        $this->actingAs($this->owner)->getJson(route('web.start-receipt', $request->requestId))
            ->assertOk()
            ->assertJsonPath('state', 'accepted')
            ->assertJsonPath('sessionId', $session->id);
    }

    public function test_a_user_the_journal_does_not_admit_is_refused_before_any_key_is_read(): void
    {
        $request = $this->request();
        SessionRequest::create($request, TestSelections::pinOf($request), $this->ownerIdentity(), None::create());
        $member = User::factory()->create();

        $this->actingAs($member)->getJson(route('web.start-receipt', $request->requestId))
            ->assertForbidden()
            ->assertDontSee($request->requestId);
    }

    private function ownerIdentity(): ActorIdentity
    {
        return ActorIdentity::of(ActorContext::forUser($this->owner->id));
    }

    private function request(): StartRequest
    {
        return new StartRequest(
            TestSelections::requestId(),
            $this->agent->id,
            TestSelections::of(),
            StartOriginType::OwnerRequest,
            new RecordIdentity('tests.owner', '01m7wgahp0n7766x1e1ta8ehew'),
            null,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile(TestSelections::onHost()),
            driverType: DriverType::Headless,
        );
    }
}
