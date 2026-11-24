<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles\Http;

use App\Commands\RemoveAccount\RemoveAccountCommand;
use App\Commands\StartAgent\StartAgentCommand;
use App\Contracts\Bus\CommandBus;
use App\Enums\ConversationModeType;
use App\Enums\DriverType;
use App\Enums\StartOriginType;
use App\Models\Agents\Agent;
use App\Support\RecordIdentity;
use App\Values\StartPolicy;
use App\Values\StartRequest;
use Domain\Access\Models\User;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsOwnerRequest;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * The owner opens the account a start ran with from the account list, and still reaches it, under its label, after
 * the account was removed; a guessed start or another user sees nothing.
 */
final class StartAccountPageTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsOwnerRequest;
    use WithActiveAccount;

    public function test_the_owner_reaches_a_removed_account_from_its_start(): void
    {
        $account = $this->chooseActiveAccounts()['claude-code'];
        $this->startUserRequestAs($this->owner->id);
        $sessionId = $this->start();

        $this->actingAs($this->owner)->get('/accounts?add=1')->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.root.children.1.children.1.native.props.rows.0.recentStarts.0.sessionId', $sessionId));

        $this->startUserRequestAs($this->owner->id);
        $this->app->make(CommandBus::class)->run(new RemoveAccountCommand($account->id));

        $this->actingAs($this->owner)
            ->get("/accounts/starts/{$sessionId}")
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('accounts/StartAccountWindow')
                ->where('page.data.accountLabel', 'Test account')
                ->where('page.data.accountState', 'removing')
                ->where('page.data.sessionId', $sessionId)
                ->missing('page.data.directory'));
    }

    public function test_a_guessed_start_and_another_user_see_nothing(): void
    {
        $this->chooseActiveAccounts();
        $this->startUserRequestAs($this->owner->id);
        $sessionId = $this->start();

        $this->actingAs($this->owner)
            ->get('/accounts/starts/'.Str::lower((string) Str::ulid()))
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('page.state', 'failed')
                ->missing('page.data'));
        $this->assertFalse($this->actingAs(User::factory()->create())->get("/accounts/starts/{$sessionId}")->isOk());
    }

    private function start(): string
    {
        $agent = Agent::create('Researcher', 'read-only-helper');
        $request = new StartRequest(
            TestSelections::requestId(),
            $agent->id,
            TestSelections::of(),
            StartOriginType::OwnerRequest,
            new RecordIdentity('tests.owner', '01m7wgahp0n7766x1e1ta8ehew'),
            'helpers.job 1',
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile(TestSelections::onHost()),
            driverType: DriverType::Headless,
        );

        return $this->app->make(CommandBus::class)->run(new StartAgentCommand($request))->sessionId;
    }
}
