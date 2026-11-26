<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Commands\Accounts\RecordUsageWindow\RecordUsageWindowCommand;
use App\Enums\Accounts\AccountProcessRole;
use App\Enums\Accounts\UsageWindowSlot;
use App\Enums\Agents\SessionProcessStatus;
use App\Models\Accounts\Account;
use App\Models\Accounts\AccountUsageWindow;
use App\Support\EnrolledHost;
use App\Values\ReportedStart;
use App\Values\UsageSource;
use App\Values\UsageWindowReading;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A host reports a usage window under a claimed start, and it lands on the start's account with its used share.
 */
#[TimeLimit(seconds: 4, reason: 'It enrolls hosts and empties several tables.')]
#[TestsCommand(RecordUsageWindowCommand::class)]
final class RecordUsageWindowTest extends TestCase
{
    use CommitsHookRows;
    use WithActiveAccount;

    private const array TABLES = [
        'account_usage_windows',
        'account_usage_costs',
        'account_usage_tokens',
        'session_processes',
        'active_accounts',
        'accounts',
        'hosts',
        'command_receipts',
        'links',
    ];

    private EnrolledHost $host;

    private Account $account;

    protected function setUp(): void
    {
        parent::setUp();

        $this->account = $this->chooseActiveAccounts()['claude-code'];
        $this->host = $this->journal->enrolledHost();
    }

    public function test_a_window_lands_on_the_starts_account(): void
    {
        $key = $this->claimedStart($this->account);

        $this->journal->asSystem(new RecordUsageWindowCommand(
            new ReportedStart($this->host->hostId, $key, 1),
            new UsageWindowReading(
                'claude',
                UsageWindowSlot::SevenDay,
                42.0,
                null,
                CarbonImmutable::parse('2026-11-24T10:00:00Z')->getTimestamp(),
                UsageSource::of('window-1', 1, CarbonImmutable::parse('2026-11-21T10:00:00Z')),
            ),
        ));

        $window = AccountUsageWindow::query()->withoutGlobalScopes()->sole();
        $this->assertSame([$this->account->id, 42.0], [$window->account_id, $window->used_percent]);
    }

    private function claimedStart(Account $account, SessionProcessStatus $status = SessionProcessStatus::Running): string
    {
        $key = (string) Str::ulid();
        DB::table('session_processes')->insert([
            'id' => strtolower((string) Str::ulid()),
            'agent_id' => strtolower((string) Str::ulid()),
            'session_id' => strtolower((string) Str::ulid()),
            'host_id' => $this->host->hostId,
            'start_key' => $key,
            'account_type' => Account::linkType(),
            'account_id' => $account->id,
            'account_generation' => 1,
            'directory' => (string) $account->directory,
            'status' => $status->value,
            'role' => AccountProcessRole::Execution->value,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return $key;
    }
}
