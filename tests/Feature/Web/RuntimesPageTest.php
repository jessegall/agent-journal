<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Commands\Agents\OpenAgentRuntime\OpenAgentRuntimeCommand;
use App\Commands\Projects\EnrollHost\EnrollHostCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Enums\Drivers\DriverType;
use App\Enums\Drivers\HoldReason;
use App\Enums\Drivers\HostWakeRefusal;
use App\Enums\Drivers\RequestOutcome;
use App\Enums\Drivers\RequestProgress;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Support\ActorContext;
use App\Values\OwnerAuthority;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Inertia\Testing\AssertableInertia;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\Settings\SwitchesDomainsOff;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * The runtime status page: every runtime with its activity, settings and requests, with Chat switched off, and the
 * owner's recovery buttons that run the recovery commands.
 */
final class RuntimesPageTest extends TestCase
{
    use RefreshHookDatabase;
    use RunsTrustedCommands;
    use SwitchesDomainsOff;
    use WithActiveAccount;

    private const string STALE_RUNTIME = 'A runtime another test committed is still here.';

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->chooseActiveAccounts();
        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
    }

    public function test_the_page_lists_each_runtime_with_its_requests_and_writes_nothing(): void
    {
        $this->assertSame(0, AgentRuntime::query()->count(), self::STALE_RUNTIME);
        $this->switchDomainOff('chat');
        $this->openRuntime();
        $requests = DriverRequest::query()->count();

        $response = $this->actingAs($this->owner)->get('/web/runtimes')->assertOk();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('layout/DeclaredLayout')
            ->where('page.data.root.children.2.children.0.children.0.text', 'claude-code')
            ->where('page.data.root.children.2.children.0.children.3.key', 'observed')
            ->where('page.data.root.children.2.children.1.native.props.status.driver', 'claude-code')
            ->where('page.data.root.children.2.children.1.native.props.status.isStale', true)
            ->has('page.data.root.children.2.children.1.native.props.requests', 1)
            ->where('page.data.root.children.2.children.1.native.props.requests.0.operation', 'deliver'));

        $this->assertSame($requests, DriverRequest::query()->count());
        $this->assertSame(1, AgentRuntime::query()->count());
    }

    public function test_a_failed_request_is_retried_from_the_page_and_the_page_shows_the_new_state(): void
    {
        $this->switchDomainOff('chat');
        $this->openRuntime();
        $request = DriverRequest::query()->orderBy('sequence')->firstOrFail();
        $request->fail(RequestOutcome::EntryUnavailable);
        $request->recordRefusal(HostWakeRefusal::ContainerUnavailable, true);
        $request->refresh();

        $this->actingAs($this->owner)->get('/web/runtimes')->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.root.children.2.children.1.native.props.requests.0.canRetry', true)
            ->where('page.data.root.children.2.children.1.native.props.requests.0.rowVersion', $request->row_version));

        $this->actingAs($this->owner)
            ->post("/web/runtimes/requests/{$request->id}/retry", [
                'reason' => 'the entry is back',
                'rowVersion' => $request->row_version,
            ])
            ->assertRedirect();

        $this->assertSame(RequestProgress::Accepted, $request->fresh()?->progress);
    }

    public function test_an_uncertain_delivery_is_sent_again_from_the_page_as_a_possible_duplicate(): void
    {
        $this->switchDomainOff('chat');
        $this->openRuntime();
        $request = DriverRequest::query()->orderBy('sequence')->firstOrFail();
        $request->markUncertain();
        $request->refresh();

        $this->actingAs($this->owner)->get('/web/runtimes')->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.root.children.2.children.1.native.props.requests.0.canSendAgain', true)
            ->where('page.data.root.children.2.children.1.native.props.requests.0.canRetry', false));

        $this->actingAs($this->owner)
            ->post("/web/runtimes/requests/{$request->id}/send-again", [
                'reason' => 'it never showed up',
                'rowVersion' => $request->row_version,
                'confirmsPossibleDuplicate' => true,
            ])
            ->assertRedirect();

        $again = DriverRequest::query()->where('possible_duplicate_of_id', $request->id)->sole();
        $this->assertSame([RequestProgress::DeliveryUncertain, $request->message], [$request->fresh()?->progress, $again->message]);
    }

    public function test_a_refused_recovery_is_shown_on_the_page(): void
    {
        $this->switchDomainOff('chat');
        $this->openRuntime();
        $request = DriverRequest::query()->orderBy('sequence')->firstOrFail();
        $request->fail(RequestOutcome::EntryUnavailable);
        $request->refresh();

        $this->actingAs($this->owner)
            ->post("/web/runtimes/requests/{$request->id}/retry", [
                'reason' => 'the entry is back',
                'rowVersion' => $request->row_version + 1,
            ])
            ->assertSessionHasErrors('review');

        $this->assertSame(RequestProgress::Failed, $request->fresh()?->progress);
    }

    public function test_an_interrupt_is_released_from_the_page(): void
    {
        $this->switchDomainOff('chat');
        $this->openRuntime();
        $runtime = AgentRuntime::query()->with('session')->firstOrFail();
        $runtime->hold_reason = HoldReason::Interrupted;
        $runtime->save();

        $this->actingAs($this->owner)->get('/web/runtimes')->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.root.children.2.children.1.native.props.status.canReleaseHold', true));

        $this->actingAs($this->owner)
            ->post("/web/runtimes/{$runtime->agent_session_id}/release-hold", [
                'reason' => 'go on',
                'agentId' => $runtime->session->agent_id,
                'hold' => HoldReason::Interrupted->value,
            ])
            ->assertRedirect();

        $this->assertSame(HoldReason::None, $runtime->fresh()?->hold_reason);
    }

    public function test_a_guest_is_sent_to_sign_in(): void
    {
        $this->get('/web/runtimes')->assertRedirect('/login');
    }

    private function openRuntime(): void
    {
        $host = $this->throughEntry(new EnrollHostCommand('test host', ['/work/project']));
        $agent = Agent::create('Driven agent', 'main-agent');
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));
        $this->app->make(CommandBus::class)->run(new OpenAgentRuntimeCommand(
            $agent->id,
            $host->hostId,
            '/work/project',
            'claude-code',
            '2.1.323',
            'claude',
            DriverType::Headless,
            'claude-opus-5-5',
            firstMessage: 'hello',
        ));
    }
}
