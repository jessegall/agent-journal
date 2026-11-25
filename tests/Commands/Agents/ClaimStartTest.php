<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Commands\Accounts\SwitchAccount\SwitchAccountCommand;
use App\Commands\Agents\ClaimStart\ClaimStartCommand;
use App\Commands\Agents\OpenAgentRuntime\OpenAgentRuntimeCommand;
use App\Commands\Projects\EnrollHost\EnrollHostCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Drivers\DriverCompatibilities;
use App\Contracts\Sessions\AgentDirectory;
use App\Enums\Agents\AgentPresence;
use App\Enums\Agents\SessionProcessStatus;
use App\Enums\Drivers\DriverEvidence;
use App\Enums\Drivers\DriverType;
use App\Models\Accounts\Account;
use App\Models\Agents\Agent;
use App\Models\Sessions\SessionProcess;
use App\Resolvers\DriverCompatibilities as DriverCompatibilitiesResolver;
use App\Support\ActorContext;
use App\Support\Compatibility\DriverCompatibility;
use App\Support\DefaultDrivers;
use App\Support\EnrolledHost;
use App\Support\OpenedRuntime;
use App\Support\Relay\OutputGrantSeal;
use App\Values\AccountLabel;
use App\Values\OwnerAuthority;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A host claims a start: switching the account moves only the next start, a repeated claim after a lost acknowledgement
 * starts no second process, and a claim of a program that cannot start here ends the start with its refusal.
 */
#[TimeLimit(seconds: 5, reason: 'It enrolls a host, opens runtimes and commits each start step, emptying many tables.')]
#[TestsCommand(ClaimStartCommand::class)]
final class ClaimStartTest extends TestCase
{
    use CommitsHookRows;
    use WithActiveAccount;

    private const string REPORT_MISSING = 'cannot start in a container: its protection report is missing';

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
        'session_processes',
        'links',
        'command_receipts',
        'assignments',
        'session_policies',
    ];

    private const string FOLDER = '/work/project';

    private Account $first;

    protected function setUp(): void
    {
        parent::setUp();

        $this->first = $this->chooseActiveAccounts()['claude-code'];
        $this->app->instance(DriverCompatibilities::class, new class implements DriverCompatibilities
        {
            public function for(string $driver): DriverCompatibility
            {
                return DriverCompatibility::pinned($driver)->withEvidence(DriverEvidence::NativeShown, 'this test');
            }
        });
    }

    public function test_switching_the_account_moves_only_the_next_start(): void
    {
        $host = $this->enrollHost();
        $running = $this->open($host);
        $this->journal->asSystem(new ClaimStartCommand($host->hostId, $running->sessionId));
        $second = Account::create(
            DefaultDrivers::CLAUDE_CODE,
            AccountLabel::from('Second'),
            '/journal/accounts/second',
        );
        $this->actAsOwner();
        $this->app->make(CommandBus::class)->run(new SwitchAccountCommand($second->id));

        $next = $this->open($host);

        $this->assertSame($this->first->id, $this->startOf($running)->account_id);
        $this->assertSame($second->id, $this->startOf($next)->account_id);
    }

    public function test_a_repeated_claim_after_a_lost_acknowledgement_starts_no_second_process(): void
    {
        $host = $this->enrollHost();
        $start = $this->open($host);

        $claimed = $this->journal->asSystem(new ClaimStartCommand($host->hostId, $start->sessionId));
        $again = $this->journal->asSystem(new ClaimStartCommand($host->hostId, $start->sessionId));

        $this->assertNotNull($claimed);
        $this->assertNull($again);
    }

    public function test_a_claim_of_a_program_that_cannot_start_here_ends_the_start_with_its_refusal(): void
    {
        $this->app->instance(DriverCompatibilities::class, new class implements DriverCompatibilities
        {
            public function for(string $driver): DriverCompatibility
            {
                return DriverCompatibility::pinned($driver)->withContainedShortfall('its protection report is missing');
            }
        });
        $host = $this->enrollHost();
        $start = $this->open($host);

        $this->assertNull($this->journal->asSystem(new ClaimStartCommand($host->hostId, $start->sessionId)));

        $start = $this->startOf($start);
        $this->assertSame(SessionProcessStatus::Stopped, $start->status);
        $this->assertStringContainsString(
            self::REPORT_MISSING,
            (string) $start->refusal,
        );
        $this->assertNull($this->journal->asSystem(new ClaimStartCommand($host->hostId, $start->session_id)));
        $this->actAsOwner();
        $agent = $this->app->make(AgentDirectory::class)->visibleAgent($start->agent_id);
        $this->assertSame(AgentPresence::Failed, $agent->presence);
        $this->assertSame($start->refusal, $agent->startRefusal);
    }

    public function test_until_the_real_program_shows_its_arrangement_no_start_is_claimed(): void
    {
        $this->app->forgetInstance(DriverCompatibilities::class);
        $this->app->bind(DriverCompatibilities::class, DriverCompatibilitiesResolver::class);
        [$host, $opened] = $this->openRuntime();

        $this->signed($host, 'POST', '/host/starts/claim', ['session_id' => $opened->sessionId])->assertStatus(409);

        $this->assertSame(
            SessionProcessStatus::Pending,
            SessionProcess::query()->withoutGlobalScopes()->sole()->status,
        );
    }

    public function test_the_claim_carries_the_checked_recipe_for_the_account_folder(): void
    {
        [$host, $opened] = $this->openRuntime();

        $recipe = $this->signed($host, 'POST', '/host/starts/claim', ['session_id' => $opened->sessionId])
            ->assertOk()
            ->json('recipe');

        $this->assertSame('CLAUDE_CONFIG_DIR', $recipe['environment'][0]['name']);
        $this->assertSame('/journal/accounts/claude-code', $recipe['environment'][0]['value']);
        $this->assertSame(['ANTHROPIC_CONFIG_DIR'], $recipe['emptyFolderVariables']);
        $this->assertContains('ANTHROPIC_API_KEY', $recipe['removedVariables']);
        // Restricted mode refuses the never-ask mode every session runs in.
        $this->assertNotContains('--restricted', $recipe['startFlags']);
        $this->assertSame(['2.1.323', 'direct-processes'], [$recipe['driverVersion'], $recipe['arrangement']]);
        $this->assertStringContainsString(
            'Read(//journal/accounts/claude-code/.credentials.json)',
            $recipe['protectionSettings'],
        );
    }

    public function test_another_host_cannot_claim_the_start_of_a_runtime_assigned_elsewhere(): void
    {
        [, $opened] = $this->openRuntime();
        $other = $this->enrollHost();

        $this->signed($other, 'POST', '/host/starts/claim', ['session_id' => $opened->sessionId])->assertForbidden();

        $start = SessionProcess::query()->withoutGlobalScopes()->sole();
        $this->assertSame([SessionProcessStatus::Pending, null], [$start->status, $start->host_id]);
    }

    public function test_only_the_claiming_host_reads_the_sealed_output_grants_of_its_start(): void
    {
        [$host, $opened] = $this->openRuntime();
        $other = $this->enrollHost();
        $key = (string) $this->signed($host, 'POST', '/host/starts/claim', ['session_id' => $opened->sessionId])
            ->json('start_key');

        $snapshot = $this->signed($host, 'GET', "/host/starts/{$key}/outputs")->assertOk()->json();

        $this->assertSame([$key, [], 0], [$snapshot['start_key'], $snapshot['paths'], $snapshot['generation']]);
        $this->assertSame(
            $this->app->make(OutputGrantSeal::class)->seal($key, 0, []),
            $snapshot['seal'],
        );
        $this->signed($other, 'GET', "/host/starts/{$key}/outputs")->assertNotFound();
    }

    public function test_a_call_without_the_host_signature_is_refused(): void
    {
        [$host, $opened] = $this->openRuntime();
        $body = (string) json_encode(['session_id' => $opened->sessionId]);

        $this->call('POST', '/host/starts/claim', content: $body)->assertUnauthorized();
        $bearerOnly = ['HTTP_AUTHORIZATION' => "Bearer {$host->secret}"];
        $this->call('POST', '/host/starts/claim', server: $bearerOnly, content: $body)->assertUnauthorized();
        $this->assertSame(
            SessionProcessStatus::Pending,
            SessionProcess::query()->withoutGlobalScopes()->sole()->status,
        );
    }

    private function startOf(OpenedRuntime $runtime): SessionProcess
    {
        return SessionProcess::query()->withoutGlobalScopes()->where('session_id', $runtime->sessionId)->sole();
    }

    private function open(EnrolledHost $host): OpenedRuntime
    {
        $this->actAsOwner();
        $agent = Agent::create('Helper '.Str::random(6), 'main-agent', $this->localProject());
        $command = new OpenAgentRuntimeCommand(
            $agent->id,
            $host->hostId,
            self::FOLDER,
            'claude-code',
            '2.1.323',
            'claude',
            DriverType::Headless,
            'claude-opus-5-5',
        );

        return $this->app->make(CommandBus::class)->run($command);
    }

    private function enrollHost(): EnrolledHost
    {
        $host = $this->journal->asSystem(new EnrollHostCommand('test host '.Str::random(6), [self::FOLDER]));
        $this->actAsOwner();

        return $host;
    }

    private function actAsOwner(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));
    }

    /**
     * @param  array<string, mixed>  $body
     */
    private function signed(EnrolledHost $host, string $method, string $target, array $body = []): TestResponse
    {
        return $this->journal->hostCall($host, $method, $target, $body === [] ? '' : (string) json_encode($body));
    }

    /**
     * @return array{EnrolledHost, OpenedRuntime}
     */
    private function openRuntime(
        bool $shouldSaveDriverType = false,
        string $driver = 'claude-code',
        DriverType $driverType = DriverType::Headless,
    ): array {
        $host = $this->enrollHost();
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));
        $agent = Agent::create('Started agent '.Str::random(6), 'main-agent', $this->localProject());
        $command = new OpenAgentRuntimeCommand(
            $agent->id,
            $host->hostId,
            self::FOLDER,
            $driver,
            '2.1.323',
            'claude',
            $driverType,
            'claude-opus-5-5',
            shouldSaveDriverType: $shouldSaveDriverType,
        );

        return [$host, $this->app->make(CommandBus::class)->run($command)];
    }
}
