<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

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
 * The host reads where the outputs of a start it claimed go: nothing is sent on.
 */
#[TestsRoute('GET', 'agents.host.starts.outputs')]
final class HostStartsOutputsGetTest extends GuardedRouteEntryTestCase
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

        return RouteCall::as(Caller::SharedHost, $host)->parameters([
            'start' => $startKey,
        ]);
    }
}
