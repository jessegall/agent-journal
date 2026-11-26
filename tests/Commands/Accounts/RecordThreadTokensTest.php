<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Commands\Accounts\RecordThreadTokens\RecordThreadTokensCommand;
use App\Enums\Accounts\AccountProcessRole;
use App\Enums\Agents\SessionProcessStatus;
use App\Models\Accounts\Account;
use App\Models\Accounts\AccountUsageTokens;
use App\Support\EnrolledHost;
use App\Values\ReportedStart;
use App\Values\ThreadTokens;
use App\Values\UsageSource;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A host reports a thread's token count under a claimed start, and a newer count replaces it, never adds to it.
 */
#[TimeLimit(seconds: 4, reason: 'It enrolls hosts and empties several tables.')]
#[TestsCommand(RecordThreadTokensCommand::class)]
final class RecordThreadTokensTest extends TestCase
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

    public function test_a_newer_thread_count_replaces_the_earlier_one(): void
    {
        $key = $this->claimedStart($this->account);
        $this->recordTokens($key, 'tokens-1', 100, '2026-11-21T10:00:00Z');
        $this->recordTokens($key, 'tokens-2', 250, '2026-11-21T11:00:00Z');

        $count = AccountUsageTokens::query()->withoutGlobalScopes()->sole();
        $this->assertSame([$this->account->id, 250], [$count->account_id, $count->total]);
    }

    private function recordTokens(string $key, string $source, int $total, string $observedAt): void
    {
        $this->journal->asSystem(new RecordThreadTokensCommand(
            new ReportedStart($this->host->hostId, $key, 1),
            new ThreadTokens(
                'thread-1',
                $total,
                null,
                null,
                null,
                null,
                null,
                UsageSource::of($source, 1, CarbonImmutable::parse($observedAt)),
            ),
        ));
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
