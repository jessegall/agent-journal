<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles\Http;

use App\Drivers\Enums\HookDriver;
use App\Profiles\Models\Account;
use App\Profiles\Models\ActiveAccount;
use App\Profiles\Values\AccountLabel;
use App\Ui\Support\UiDeclarations;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Illuminate\Support\Facades\Process;
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

    private const array TABLES = ['accounts', 'active_accounts', 'sign_in_attempts', 'command_receipts', 'users'];

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
    }

    public function test_the_accounts_page_is_declared_with_a_sidebar_item(): void
    {
        $declarations = $this->app->make(UiDeclarations::class);

        $this->assertContains('accounts', array_map(fn ($owner) => $owner->key, $declarations->owners()));
        $this->actingAs($this->owner)->get('/accounts')->assertOk();
    }

    public function test_opening_accounts_reads_stored_usage_only_and_starts_no_process(): void
    {
        Process::fake();

        foreach (range(1, 3) as $visit) {
            $this->actingAs($this->owner)->get('/accounts')->assertOk();
        }

        // Only the journal's own version read may run; no provider program, account process or model call.
        Process::assertDidntRun(
            fn ($process) => (array) $process->command !== ['git', '-C', base_path(), 'rev-parse', 'HEAD'],
        );
    }

    public function test_the_owner_sees_safe_details_and_never_the_private_folder(): void
    {
        $work = $this->account('Work', '/journal/accounts/private-work-folder');

        $page = $this->actingAs($this->owner)->get('/accounts')->assertOk()->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('layout/DeclaredLayout')
                ->where('page.data.root.children.1.key', 'accounts')
                ->where('page.data.root.children.1.native.component', 'accounts/AccountsWindow')
                ->has('page.data.root.children.1.native.props.rows', 1)
                ->where('page.data.root.children.1.native.props.rows.0.id', $work->id)
                ->where('page.data.root.children.1.native.props.rows.0.label', 'Work')
                ->where('page.data.root.children.1.native.props.rows.0.state', 'signed_in')
                ->where('page.data.root.children.1.native.props.rows.0.isActive', false)
                ->where('page.data.root.children.1.native.props.rows.0.runningCount', 0),
        );

        $this->assertStringNotContainsString('private-work-folder', (string) $page->getContent());
    }

    public function test_the_owner_chooses_and_renames_an_account(): void
    {
        $work = $this->account('Work', '/journal/accounts/work');

        $this->actingAs($this->owner)->post("/accounts/{$work->id}/activate")->assertStatus(303);
        $this->actingAs($this->owner)
            ->patch("/accounts/{$work->id}", ['label' => ' Office '])
            ->assertStatus(303);

        $this->actingAs($this->owner)->get('/accounts')->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.root.children.1.native.props.rows.0.label', 'Office')
            ->where('page.data.root.children.1.native.props.rows.0.isActive', true)
            ->where('page.data.root.children.1.native.props.selections.0.accountId', $work->id)
            ->where('page.data.root.children.1.native.props.selections.0.changeNumber', 1)
            ->where('page.data.root.children.0.key', 'starts')
            ->where('page.data.root.children.1.key', 'accounts'));
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
        return Account::create(HookDriver::ClaudeCode, AccountLabel::from($label), $directory);
    }
}
