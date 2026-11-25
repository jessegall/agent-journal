<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Commands\Accounts\BeginSignInAgain\BeginSignInAgainCommand;
use App\Commands\Accounts\ReconcileAccounts\ReconcileAccountsCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Accounts\SignInStatus;
use App\Jobs\SignInDeadline;
use App\Models\Access\User;
use App\Models\Accounts\SignInAttempt;
use App\Support\Access\AccessSettings;
use App\Support\ActorContext;
use App\Support\JournalCommands;
use App\Values\OwnerAuthority;
use Illuminate\Support\Facades\Bus;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsKeyedCommands;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * The sweep ends an overdue attempt, and signing in again holds the folder once.
 */
#[TimeLimit(seconds: 3, reason: 'It commits attempts and accounts through the bus and empties five tables per test.')]
final class ReconcileAccountsTest extends TestCase
{
    use CommitsHookRows;
    use RunsKeyedCommands;
    use WithActiveAccount;

    private const array TABLES = [
        'users',
        'accounts',
        'active_accounts',
        'sign_in_attempts',
        'command_receipts',
        'links',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        User::factory()->create(['id' => TestIds::of(1)]);
        $this->app->instance(AccessSettings::class, new AccessSettings(TestIds::of(1)));

        Bus::fake([SignInDeadline::class]);
        $this->actAsOwner();
    }

    public function test_the_sweep_ends_an_overdue_attempt_and_signing_in_again_holds_the_folder_once(): void
    {
        $account = $this->chooseActiveAccounts()['codex'];
        $this->actAsOwner();
        $again = $this->runOnBus(new BeginSignInAgainCommand($account->id), 'request-again');
        $rejoined = $this->runOnBus(new BeginSignInAgainCommand($account->id), 'request-other');

        $this->assertSame($again->attemptId, $rejoined->attemptId);
        $this->assertSame($again->attemptId, $account->refresh()->live_writer_attempt_id);
        $this->travel(16)->minutes();

        $ended = $this->app->make(JournalCommands::class)
            ->runAsJournal(CommandEntry::AccountMaintenance, 'test sweep', new ReconcileAccountsCommand());

        $this->assertSame(1, $ended);
        $this->assertSame(SignInStatus::Expired, SignInAttempt::query()->whereKey($again->attemptId)->sole()->status);
        $this->assertNull($account->refresh()->live_writer_attempt_id);
    }

    private function actAsOwner(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
    }
}
