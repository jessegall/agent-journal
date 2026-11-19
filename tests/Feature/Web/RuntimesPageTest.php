<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Agents\Commands\EnrollHost;
use App\Agents\Commands\OpenAgentRuntime;
use App\Agents\Enums\DriverType;
use App\Agents\Enums\HoldReason;
use App\Agents\Enums\RequestOutcome;
use App\Agents\Enums\RequestProgress;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\DriverRequest;
use App\Bus\Contracts\CommandBus;
use App\Settings\Models\SettingsRecord;
use App\Settings\Storage\EncodedToggle;
use App\Settings\Storage\EncodedValue;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Inertia\Testing\AssertableInertia;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\RunsTrustedCommands;
use Tests\TestCase;

/**
 * The runtime status page: every runtime with its activity, settings and requests, with Chat switched off, and the
 * owner's recovery buttons that run the recovery commands.
 */
final class RuntimesPageTest extends TestCase
{
    use RefreshHookDatabase;
    use RunsTrustedCommands;

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();
        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
    }

    public function test_the_page_lists_each_runtime_with_its_requests_and_writes_nothing(): void
    {
        $this->assertSame(0, AgentRuntime::query()->count(), 'A runtime another test committed is still here.');
        $this->switchChatOff();
        $this->openRuntime();
        $requests = DriverRequest::query()->count();

        $response = $this->actingAs($this->owner)->get('/web/runtimes')->assertOk();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('web/Runtimes')
            ->where('page.data.runtimes.0.status.program', 'claude-code')
            ->where('page.data.runtimes.0.status.isStale', true)
            ->has('page.data.runtimes.0.requests', 1)
            ->where('page.data.runtimes.0.requests.0.operation', 'deliver'));

        $this->assertSame($requests, DriverRequest::query()->count());
        $this->assertSame(1, AgentRuntime::query()->count());
    }

    public function test_a_failed_request_is_retried_from_the_page_and_the_page_shows_the_new_state(): void
    {
        $this->switchChatOff();
        $this->openRuntime();
        $request = DriverRequest::query()->orderBy('sequence')->firstOrFail();
        $request->fail(RequestOutcome::EntryUnavailable);
        $request->refresh();

        $this->actingAs($this->owner)->get('/web/runtimes')->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.runtimes.0.requests.0.canRetry', true)
            ->where('page.data.runtimes.0.requests.0.rowVersion', $request->row_version));

        $this->actingAs($this->owner)
            ->post("/web/runtimes/requests/{$request->id}/retry", [
                'reason' => 'the entry is back',
                'rowVersion' => $request->row_version,
            ])
            ->assertRedirect();

        $this->assertSame(RequestProgress::Accepted, $request->fresh()?->progress);
    }

    public function test_a_refused_recovery_is_shown_on_the_page(): void
    {
        $this->switchChatOff();
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
        $this->switchChatOff();
        $this->openRuntime();
        $runtime = AgentRuntime::query()->firstOrFail();
        $runtime->hold_reason = HoldReason::Interrupted;
        $runtime->save();

        $this->actingAs($this->owner)->get('/web/runtimes')->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.runtimes.0.status.canReleaseHold', true));

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
        $host = $this->throughEntry(new EnrollHost('test host', ['/work/project']));
        $agent = Agent::named('Driven agent', 'main-agent');
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));
        $this->app->make(CommandBus::class)->run(new OpenAgentRuntime(
            $agent->id,
            $host->hostId,
            '/work/project',
            'claude-code',
            '2.1.323',
            'claude',
            DriverType::Process,
            'claude-opus-5-5',
            firstMessage: 'hello',
        ));
    }

    private function switchChatOff(): void
    {
        SettingsRecord::insertIfAbsent('Core');
        $record = SettingsRecord::sharedRuntimeForOwner('Core')->get();
        $record->revise($record->document->withToggle(new EncodedToggle('domain_chat', EncodedValue::of(false))));
        $this->app->forgetScopedInstances();
    }
}
