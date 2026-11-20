<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Agents\Commands\ClaimStart;
use App\Agents\Commands\EnrollHost;
use App\Agents\Commands\OpenAgentRuntime;
use App\Agents\Commands\ReconcileStarts;
use App\Agents\Enums\DriverType;
use App\Agents\Models\Agent;
use App\Agents\Models\ProcessStart;
use App\Agents\Support\EnrolledHost;
use App\Agents\Support\OpenedRuntime;
use App\Bus\Contracts\CommandBus;
use App\Hooks\Contracts\ProgramCompatibilities;
use App\Hooks\Enums\ProgramEvidence;
use App\Hooks\Support\ProgramCompatibility;
use App\Profiles\Commands\SwitchAccount;
use App\Profiles\Models\Account;
use App\Profiles\Values\AccountLabel;
use App\Programs\Enums\HookProgram;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A launch keeps the account it was accepted on and is never started twice (task 420): switching the active account
 * while a helper runs moves only the next launch, a repeated claim after a lost acknowledgement starts no second
 * process, and a restarted host's claimed launch stays possibly running until its exit is proven.
 */
#[TimeLimit(seconds: 5, reason: 'It enrolls a host, opens runtimes and commits each start step, emptying many tables.')]
final class ContainerAccountTest extends TestCase
{
    use CommitsHookRows;
    use RunsTrustedCommands;
    use WithActiveAccount;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'start_tokens',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'driver_turns',
        'accounts',
        'active_accounts',
        'process_starts',
        'links',
        'command_receipts',
        'assignments',
    ];

    private const string FOLDER = '/work/project';

    private Account $first;

    protected function setUp(): void
    {
        parent::setUp();

        $this->first = $this->chooseActiveAccounts()['claude-code'];
        $this->app->instance(ProgramCompatibilities::class, new class implements ProgramCompatibilities
        {
            public function for(HookProgram $program): ProgramCompatibility
            {
                return ProgramCompatibility::pinned($program)->withEvidence(ProgramEvidence::NativeShown);
            }
        });
    }

    public function test_switching_the_account_moves_only_the_next_launch(): void
    {
        $host = $this->enrollHost();
        $running = $this->open($host);
        $this->asSystem(new ClaimStart($host->hostId, $running->sessionId));
        $second = Account::signedIn(HookProgram::ClaudeCode, AccountLabel::from('Second'), '/journal/accounts/second');
        $this->actAsOwner();
        $this->app->make(CommandBus::class)->run(new SwitchAccount($second->id));

        $next = $this->open($host);

        $this->assertSame($this->first->id, $this->startOf($running)->account_id);
        $this->assertSame($second->id, $this->startOf($next)->account_id);
    }

    public function test_a_repeated_claim_after_a_lost_acknowledgement_starts_no_second_process(): void
    {
        $host = $this->enrollHost();
        $launch = $this->open($host);

        $claimed = $this->asSystem(new ClaimStart($host->hostId, $launch->sessionId));
        $again = $this->asSystem(new ClaimStart($host->hostId, $launch->sessionId));

        $this->assertNotNull($claimed);
        $this->assertNull($again);
    }

    public function test_a_restarted_hosts_claimed_launch_stays_possibly_running_until_its_exit_is_proven(): void
    {
        $host = $this->enrollHost();
        $launch = $this->open($host);
        $this->asSystem(new ClaimStart($host->hostId, $launch->sessionId));
        $key = $this->startOf($launch)->start_key;

        $this->asSystem(new ReconcileStarts($host->hostId, []));

        $this->assertSame([$key], ProcessStart::unresolvedKeysOf($host->hostId));

        $this->asSystem(new ReconcileStarts($host->hostId, [$key]));

        $this->assertSame([], ProcessStart::unresolvedKeysOf($host->hostId));
    }

    private function startOf(OpenedRuntime $runtime): ProcessStart
    {
        return ProcessStart::query()->withoutGlobalScopes()->where('session_id', $runtime->sessionId)->sole();
    }

    private function open(EnrolledHost $host): OpenedRuntime
    {
        $this->actAsOwner();
        $agent = Agent::named('Helper '.Str::random(6), 'main-agent');
        $command = new OpenAgentRuntime(
            $agent->id,
            $host->hostId,
            self::FOLDER,
            'claude-code',
            '2.1.323',
            'claude',
            DriverType::Process,
            'claude-opus-5-5',
        );

        return $this->app->make(CommandBus::class)->run($command);
    }

    private function enrollHost(): EnrolledHost
    {
        $host = $this->asSystem(new EnrollHost('test host '.Str::random(6), [self::FOLDER]));
        $this->actAsOwner();

        return $host;
    }

    private function actAsOwner(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));
    }
}
