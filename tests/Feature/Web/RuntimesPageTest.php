<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Agents\Commands\EnrollHost;
use App\Agents\Commands\OpenAgentRuntime;
use App\Agents\Enums\DriverType;
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
 * The read-only runtime status page: every runtime with its activity, settings and requests, with Chat switched off.
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
