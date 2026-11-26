<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Accounts\AddUsageCost\AddUsageCostCommand;
use App\Enums\Accounts\AccountProcessRole;
use App\Enums\Agents\SessionProcessStatus;
use App\Models\Accounts\Account;
use App\Support\DefaultDrivers;
use App\Values\AccountLabel;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host reports what a start of an account used.
 */
#[TestsRoute('POST', 'agents.host.reports.usage')]
final class HostReportsUsagePostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();
        $account = Account::create(DefaultDrivers::CLAUDE_CODE, AccountLabel::from('Home'), '/journal/accounts/home');
        $startKey = (string) Str::ulid();
        DB::table('session_processes')->insert([
            'id' => strtolower((string) Str::ulid()),
            'agent_id' => strtolower((string) Str::ulid()),
            'session_id' => strtolower((string) Str::ulid()),
            'host_id' => $host->hostId,
            'start_key' => $startKey,
            'account_type' => Account::linkType(),
            'account_id' => $account->id,
            'account_generation' => 1,
            'directory' => (string) $account->directory,
            'status' => SessionProcessStatus::Running->value,
            'role' => AccountProcessRole::Execution->value,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return RouteCall::as(Caller::SharedHost, $host)
            ->payload([
                'start_key' => $startKey,
                'generation' => 1,
                'source_id' => 'result-1',
                'source_order' => 1,
                'observed_at' => '2026-11-26T10:00:00Z',
                'measurement' => [
                    'type' => 'result_cost',
                    'usd' => '0.25',
                ],
            ])
            ->expects(AddUsageCostCommand::class);
    }
}
