<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles\Http;

use App\Models\Access\User;
use App\Models\Accounts\Account;
use App\Models\Accounts\ActiveAccount;
use App\Support\Access\AccessSettings;
use App\Support\DefaultDrivers;
use App\Values\AccountLabel;
use Inertia\Testing\AssertableInertia;
use Tests\Support\CommitsHookRows;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The owner reaches the Accounts page from the sidebar, sees each saved account's safe details and running count,
 * chooses the account new starts use and renames one; anyone else sees and changes nothing.
 */
#[TimeLimit(seconds: 10, reason: 'It renders pages, commits account changes and empties five tables per test.')]
final class AccountsPageTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['accounts', 'active_accounts', 'sign_in_attempts', 'command_receipts', 'users', 'account_usage_windows'];

    private const string ROWS = 'page.data.root.children.1.children.0.children.0.children.0.rows';

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
    }

    public function test_the_owner_chooses_and_renames_an_account(): void
    {
        $work = $this->account('Work', '/journal/accounts/work');

        $this->actingAs($this->owner)->post("/accounts/{$work->id}/activate")->assertStatus(303);
        $this->actingAs($this->owner)
            ->patch("/accounts/{$work->id}", ['label' => ' Office '])
            ->assertStatus(303);

        $this->actingAs($this->owner)->get("/accounts?account={$work->id}")->assertInertia(
            fn (AssertableInertia $page) => $page
                ->where(self::ROWS.'.0.label', 'Office')
                ->where(self::ROWS.'.0.isCurrent', true)
                ->where('page.data.root.children.1.children.1.key', 'detail')
                ->where('page.data.root.children.1.children.1.children.2.key', 'account')
                ->where('page.data.root.children.1.children.1.children.2.children.1.children.0.key', 'row-name')
                ->where('page.data.root.children.1.children.1.children.2.children.1.children.1.key', 'row-default'),
        );
    }

    public function test_another_user_can_neither_see_nor_change_accounts(): void
    {
        $work = $this->account('Work', '/journal/accounts/work');
        $other = User::factory()->create();

        $this->assertFalse($this->actingAs($other)->get('/accounts')->isOk());
        $this->assertFalse($this->actingAs($other)->post("/accounts/{$work->id}/activate")->isRedirection());
        $this->assertSame(0, ActiveAccount::query()->withoutGlobalScopes()->count());
    }

    private function account(string $label, string $directory): Account
    {
        return Account::create(DefaultDrivers::CLAUDE_CODE, AccountLabel::from($label), $directory);
    }
}
