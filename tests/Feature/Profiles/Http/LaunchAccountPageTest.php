<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles\Http;

use App\Agents\Commands\LaunchAgent;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\LaunchOriginType;
use App\Agents\Models\Agent;
use App\Agents\Support\LaunchPolicy;
use App\Agents\Support\LaunchRequest;
use App\Bus\Contracts\CommandBus;
use App\Profiles\Commands\RemoveAccount;
use Domain\Access\Models\User;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsOwnerRequest;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * The owner opens the account a launch ran with from the account list, and still reaches it, under its label, after
 * the account was removed; a guessed launch or another person sees nothing.
 */
final class LaunchAccountPageTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsOwnerRequest;
    use WithActiveAccount;

    public function test_the_owner_reaches_a_removed_account_from_its_launch(): void
    {
        $account = $this->chooseActiveAccounts()['claude-code'];
        $this->startUserRequestAs($this->owner->id);
        $sessionId = $this->launch();

        $this->actingAs($this->owner)->get('/accounts')->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.rows.0.recentLaunches.0.sessionId', $sessionId));

        $this->startUserRequestAs($this->owner->id);
        $this->app->make(CommandBus::class)->run(new RemoveAccount($account->id));

        $this->actingAs($this->owner)
            ->get("/accounts/launches/{$sessionId}")
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('accounts/LaunchAccountWindow')
                ->where('page.data.accountLabel', 'Test account')
                ->where('page.data.accountState', 'removing')
                ->where('page.data.sessionId', $sessionId)
                ->missing('page.data.directory'));
    }

    public function test_a_guessed_launch_and_another_person_see_nothing(): void
    {
        $this->chooseActiveAccounts();
        $this->startUserRequestAs($this->owner->id);
        $sessionId = $this->launch();

        $this->actingAs($this->owner)
            ->get('/accounts/launches/'.Str::lower((string) Str::ulid()))
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('page.state', 'failed')
                ->missing('page.data'));
        $this->assertFalse($this->actingAs(User::factory()->create())->get("/accounts/launches/{$sessionId}")->isOk());
    }

    private function launch(): string
    {
        $agent = Agent::named('Researcher', 'read-only-helper');
        $request = new LaunchRequest(
            TestSelections::requestId(),
            $agent->id,
            TestSelections::of(),
            LaunchOriginType::OwnerRequest,
            'helpers.job 1',
            'helpers.job 1',
            ConversationModeType::New,
            null,
            LaunchPolicy::withoutProfile(TestSelections::onHost()),
        );

        return $this->app->make(CommandBus::class)->run(new LaunchAgent($request))->sessionId;
    }
}
