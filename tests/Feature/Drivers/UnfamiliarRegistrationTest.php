<?php

declare(strict_types=1);

namespace Tests\Feature\Drivers;

use App\Commands\DeliverAgent\DeliverAgentCommand;
use App\Commands\InterruptAgent\InterruptAgentCommand;
use App\Commands\OpenAgentRuntime\OpenAgentRuntimeCommand;
use App\Commands\StopAgent\StopAgentCommand;
use App\Contracts\Drivers\DriverCatalogue;
use App\Enums\DriverVariant;
use App\Enums\HoldReason;
use App\Enums\RequestProgress;
use App\Exceptions\DriverRequestRefused;
use App\Models\Accounts\Account;
use App\Models\Accounts\ActiveAccount;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Support\DefaultDrivers;
use App\Support\DriverRegistry;
use App\Values\AccountLabel;
use App\Values\DriverFamily;
use App\Values\DriverKey;
use App\Values\DriverRegistration;
use App\Values\ProviderKey;
use Tests\Fixtures\Drivers\AcmeReaderCapabilities;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\TestCase;

/**
 * A driver the journal has never heard of, registered under a namespaced key of the longest length, runs a turn
 * through the ordinary path: open, deliver, claim, report and the outcome, with nothing branching on its name
 *.
 */
final class UnfamiliarRegistrationTest extends TestCase
{
    use CommitsHookRows;
    use OpensLedgerRuntimes;
    use RunsTrustedCommands;
    use SendsHostCalls;

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
    ];

    public function test_an_unfamiliar_registration_delivers_a_turn_and_returns_its_outcome(): void
    {
        $key = 'example/echo-'.str_repeat('a', DriverKey::CHARACTER_LIMIT - strlen('example/echo-'));
        $this->register($key);
        ActiveAccount::lockedFor('example')->select(
            Account::create('example', AccountLabel::from('Echo account'), '/journal/accounts/example'),
        );
        $host = $this->enrollHost();
        $agent = $this->agent();

        $opened = $this->asOwner(new OpenAgentRuntimeCommand(
            $agent->id,
            $host->hostId,
            self::FOLDER,
            'example',
            '1.0.0',
            'echo',
            DriverVariant::Headless,
            'echo-small',
        ));
        $receipt = $this->asOwner(DeliverAgentCommand::text($agent->id, $opened->sessionId, 'echo-1', 'Say hello'));
        $claimed = collect($this->hostCall($host, '/host/claim?limit=10&wait=0&watched_version=0')->assertOk()->json('requests'))
            ->firstOrFail(fn (array $request) => $request['requestId'] === $receipt->requestId);
        $this->hostCall($host, '/host/reports/request', [
            'request_id' => $receipt->requestId,
            'attempt' => $claimed['attempt'],
            'progress' => 'applied',
            'actual_binding' => null,
            'session_id' => $claimed['sessionId'],
            'process_start_id' => $claimed['processStartId'],
            'process_generation' => $claimed['processGeneration'],
        ])->assertSuccessful();

        $this->assertSame(
            [$key, 'Echo', 'Say hello', RequestProgress::Applied],
            [
                AgentRuntime::query()->findOrFail($opened->runtimeId)->driver_key,
                AgentRuntime::query()->findOrFail($opened->runtimeId)->driver_label,
                $claimed['parts'][0]['text'],
                DriverRequest::query()->findOrFail($receipt->requestId)->progress,
            ],
        );
    }

    public function test_an_unfamiliar_registration_is_interrupted_and_stopped_through_the_standard_commands(): void
    {
        $this->register('example/echo');
        ActiveAccount::lockedFor('example')->select(
            Account::create('example', AccountLabel::from('Echo account'), '/journal/accounts/example'),
        );
        $agent = $this->agent();
        $opened = $this->asOwner(new OpenAgentRuntimeCommand(
            $agent->id,
            $this->enrollHost()->hostId,
            self::FOLDER,
            'example',
            '1.0.0',
            'echo',
            DriverVariant::Headless,
            'echo-small',
        ));

        $this->asOwner(new InterruptAgentCommand($agent->id, $opened->sessionId, 'interrupt-1'));
        $held = AgentRuntime::query()->findOrFail($opened->runtimeId)->hold_reason;
        $this->asOwner(new StopAgentCommand($agent->id, $opened->sessionId, 'stop-1'));

        $this->assertSame(HoldReason::Interrupted, $held);
        $this->assertThrows(
            fn () => $this->asOwner(DeliverAgentCommand::text($agent->id, $opened->sessionId, 'late', 'Too late')),
            DriverRequestRefused::class,
        );
    }

    private function register(string $key): void
    {
        $registry = $this->app->make(DriverCatalogue::class);
        $this->assertInstanceOf(DriverRegistry::class, $registry);
        $headless = $registry->forKey(DriverKey::from('claude-code-headless'))->descriptor();
        $claude = $registry->family(DefaultDrivers::CLAUDE_CODE);
        $registry->registerFamily(
            new DriverFamily('example', 'Example', ProviderKey::from('example'), 'echo', $claude->isolatesHooksPerSession, []),
        );
        $registry->register(new DriverRegistration(
            DriverKey::from($key),
            'example',
            DriverVariant::Headless,
            'Echo',
            [],
            $headless->hookProtocol,
            $headless->accountProtocol,
            $headless->skillProtocol,
            AcmeReaderCapabilities::class,
            [],
        ));
    }
}
