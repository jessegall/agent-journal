<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles\Http;

use App\Enums\UsageWindowSlot;
use App\Http\Pages\Accounts\AccountsIndex;
use App\Models\Account;
use App\Models\ActiveAccount;
use App\Support\DefaultDrivers;
use App\Support\UiDeclarations;
use App\Support\UsageReadings;
use App\Values\AccountLabel;
use App\Values\UsageSource;
use App\Values\UsageWindowReading;
use Carbon\CarbonImmutable;
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

    private const array TABLES = ['accounts', 'active_accounts', 'sign_in_attempts', 'command_receipts', 'users', 'account_usage_windows'];

    private const string ROWS = 'page.data.root.children.1.children.0.children.0.children.0.rows';

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

        // Only the journal's own version read may run; no provider driver, account process or model call.
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
                ->has(self::ROWS, 1)
                ->where(self::ROWS.'.0.key', $work->id)
                ->where(self::ROWS.'.0.label', 'Work')
                ->where(self::ROWS.'.0.leading.0.style', 'driver')
                ->where(self::ROWS.'.0.trailing.0.key', 'state'),
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

    public function test_a_row_shows_the_most_used_window_as_a_meter_and_the_reader_names_both_windows(): void
    {
        $work = $this->account('Work', '/journal/accounts/work');
        $source = UsageSource::of('start-1', 1, CarbonImmutable::now());
        $resets = CarbonImmutable::now()->addDay()->getTimestamp();
        $readings = $this->app->make(UsageReadings::class);
        $readings->recordWindow($work, 1, new UsageWindowReading('claude', UsageWindowSlot::SevenDay, 72.0, 10080, $resets, $source));
        $readings->recordWindow($work, 1, new UsageWindowReading('claude', UsageWindowSlot::FiveHour, 30.0, 300, $resets, $source));

        $this->actingAs($this->owner)->get("/accounts?account={$work->id}")->assertInertia(
            fn (AssertableInertia $page) => $page
                ->where(self::ROWS.'.0.trailing.1.style', 'usage-row')
                ->where(self::ROWS.'.0.trailing.1.progress.value', 72)
                ->where(
                    self::ROWS.'.0.trailing.1.detail',
                    fn ($tip) => str_contains($tip, AccountsIndex::WEEK_LABEL.' 72% used')
                        && str_contains($tip, AccountsIndex::SESSION_LABEL.' 30% used'),
                )
                ->where(
                    'page.data.root.children.1.children.1',
                    fn ($reader) => str_contains(json_encode($reader), AccountsIndex::WEEK_LABEL)
                        && str_contains(json_encode($reader), AccountsIndex::SESSION_LABEL),
                ),
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
