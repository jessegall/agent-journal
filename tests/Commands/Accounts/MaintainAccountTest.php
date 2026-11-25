<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Drivers\DriverCompatibilities;
use App\Enums\Accounts\SignInMethod;
use App\Enums\Drivers\DriverEvidence;
use App\Models\Accounts\Account;
use App\Models\Accounts\SignInAttempt;
use App\Models\Agents\Agent;
use App\Support\AccountMaintenance;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\Compatibility\DriverCompatibility;
use App\Values\OwnerAuthority;
use Carbon\CarbonImmutable;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * An account's maintenance against every writer of it: it holds new starts, cancels starts no host took, waits for
 * claimed starts until their host proves them gone and for a live sign-in, and a retired agent's unclaimed start
 * never runs.
 */
#[TimeLimit(
    seconds: 5,
    reason: 'It opens runtimes, enrolls hosts and commits maintenance steps, emptying many tables.',
)]
final class MaintainAccountTest extends TestCase
{
    use CommitsHookRows;
    use RunsTrustedCommands;
    use WithActiveAccount;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'driver_turns',
        'accounts',
        'active_accounts',
        'sign_in_attempts',
        'session_processes',
        'links',
        'command_receipts',
        'assignments',
    ];

    private Account $account;

    protected function setUp(): void
    {
        parent::setUp();

        $this->account = $this->chooseActiveAccounts()['claude-code'];
        $this->app->instance(DriverCompatibilities::class, new class implements DriverCompatibilities
        {
            public function for(string $driver): DriverCompatibility
            {
                $pinned = DriverCompatibility::pinned($driver);

                return $pinned->withEvidence(DriverEvidence::NativeShown, 'this test');
            }
        });
    }

    public function test_a_live_sign_in_writer_keeps_maintenance_from_settling(): void
    {
        $attempt = SignInAttempt::create(
            ActorIdentity::system(),
            $this->account,
            SignInMethod::OAuth,
            '/journal/accounts/staging-request-1',
            CarbonImmutable::now()->addMinutes(10),
        );
        $this->account->writerFor($attempt);
        $attempt->writeInGeneration($this->account->sign_in_generation);

        $progress = $this->maintenance()->advance($this->account->id);

        $this->assertSame([true, false], [$progress->isCredentialWriteInProgress, $progress->isSettled]);
    }

    private function maintenance(): AccountMaintenance
    {
        $this->actAsOwner();

        return $this->app->make(AccountMaintenance::class);
    }

    private function actAsOwner(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));
    }
}
