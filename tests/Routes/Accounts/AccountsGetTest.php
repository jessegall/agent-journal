<?php

declare(strict_types=1);

namespace Tests\Routes\Accounts;

use App\Http\Middleware\Web\HandleInertiaRequests;
use App\Http\Requests\Profiles\AccountsInput;
use App\Http\Responses\LoaderProps;
use App\Web\Creation\SurfaceContexts;
use App\Web\Creation\SurfacePayload;
use App\Web\Values\LoaderInput;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Testing\AssertableInertia;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner opens their accounts.
 */
#[TestsRoute('GET', 'accounts.accounts')]
final class AccountsGetTest extends GuardedRouteEntryTestCase
{
    public function test_the_last_account_page_can_open_a_selected_account_from_the_first_page(): void
    {
        $journal = $this->journal->owner()->chooseActiveAccount('codex', 'Account 01', '/journal/accounts/01');
        $first = $journal->chosenAccounts()['codex'];

        foreach (range(2, 26) as $number) {
            $journal->chooseActiveAccount('codex', sprintf('Account %02d', $number), "/journal/accounts/{$number}");
        }

        $this->actingAs($journal->ownerUser())
            ->get(route('accounts.accounts', ['page' => 2, 'account' => $first->id]))
            ->assertInertia(fn (AssertableInertia $inertia) => $inertia
                ->where('page.status', 'ready')
                ->where('page.data.root.children.0.children.1.text', '26')
                ->has('page.data.root.children.1.children.0.children.1.children.0.rows', 1)
                ->where('page.data.root.children.1.children.0.children.1.children.0.rows.0.label', 'Account 26')
                ->where('page.data.root.children.1.children.1.children.0.children.0.text', 'Account 01'));
    }

    public function test_the_add_query_is_validated_before_cast(): void
    {
        $contexts = $this->app->make(SurfaceContexts::class);
        $withAdd = $contexts->forVisit(Request::create('/accounts?add=1'));
        $withoutAdd = $contexts->forVisit(Request::create('/accounts?add=0'));
        $this->assertTrue(AccountsInput::factory()->alwaysValidate()->from(new SurfacePayload($withAdd, []))->isAdding);
        $this->assertFalse(AccountsInput::factory()->alwaysValidate()->from(new SurfacePayload($withoutAdd, []))->isAdding);

        $invalid = $contexts->forVisit(Request::create('/accounts?add=false'));
        $this->expectException(ValidationException::class);

        AccountsInput::factory()->alwaysValidate()->from(new SurfacePayload($invalid, []));
    }

    public function test_a_loader_only_request_does_not_read_or_validate_the_page(): void
    {
        $journal = $this->journal->owner();
        $uri = route('accounts.accounts', ['add' => 'invalid'], false);
        $prop = 'load_accounts_sign_in_receipt';
        $token = 'receipt-call';
        $payload = json_encode([
            'token' => $token,
            'input' => ['key' => 'unsubmitted-key', 'driver' => 'codex'],
        ], JSON_THROW_ON_ERROR);

        $this->actingAs($journal->ownerUser())->get($uri, [
            'X-Inertia' => 'true',
            'X-Inertia-Version' => (string) $this->app->make(HandleInertiaRequests::class)->version(
                Request::create($uri),
            ),
            'X-Inertia-Partial-Component' => 'layout/DeclaredLayout',
            'X-Inertia-Partial-Data' => $prop,
            LoaderProps::HEADER => 'accounts.sign-in-receipt',
            LoaderInput::HEADER => rtrim(strtr(base64_encode($payload), '+/', '-_'), '='),
        ])->assertOk()
            ->assertJsonPath("props.{$prop}.token", $token)
            ->assertJsonPath("props.{$prop}.status", 'ok')
            ->assertJsonMissingPath('props.title')
            ->assertJsonMissingPath('props.page');
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner()->user('Member');

        return RouteCall::as(Caller::User)
            ->hiddenFrom('Member');
    }
}
