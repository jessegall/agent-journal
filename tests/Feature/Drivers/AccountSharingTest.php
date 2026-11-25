<?php

declare(strict_types=1);

namespace Tests\Feature\Drivers;

use App\Commands\Agents\OpenAgentRuntime\OpenAgentRuntimeCommand;
use App\Contracts\Drivers\DriverCatalogue as DriverCatalogueContract;
use App\Enums\Drivers\DriverType;
use App\Exceptions\AccountWriterTaken;
use App\Models\Accounts\Account;
use App\Models\Accounts\ActiveAccount;
use App\Support\DefaultDrivers;
use App\Support\DriverCatalogue;
use App\Support\EnrolledHost;
use App\Support\OpenedRuntime;
use App\Values\AccountLabel;
use App\Values\DriverFamily;
use App\Values\DriverKey;
use App\Values\DriverRegistration;
use App\Values\ProviderKey;
use Tests\Fixtures\Drivers\AcmeReaderCapabilities;
use Tests\Fixtures\Drivers\RunsAloneCapabilities;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\TestCase;

/**
 * A driver that refreshes its own sign-in runs alone on its account: it is refused beside a running writer, nothing
 * starts beside it, and the writer already there keeps running.
 */
final class AccountSharingTest extends TestCase
{
    use CommitsHookRows;
    use OpensLedgerRuntimes;
    use RunsTrustedCommands;
    use SendsHostCalls;

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
    ];

    protected function setUp(): void
    {
        parent::setUp();
        $this->registerFamily();
        ActiveAccount::lockedFor('example')->select(
            Account::create('example', AccountLabel::from('Shared account'), '/journal/accounts/example'),
        );
    }

    public function test_a_driver_that_runs_alone_is_refused_on_an_account_in_use(): void
    {
        $host = $this->enrollHost();
        $writer = $this->open($host, DriverType::Headless);

        $refused = $this->assertThrowsAccountWriterTaken(fn () => $this->open($host, DriverType::Terminal));

        $this->assertSame($writer->sessionId, $refused->ownerSessionId);
    }

    public function test_nothing_starts_on_an_account_a_driver_runs_alone_on(): void
    {
        $host = $this->enrollHost();
        $alone = $this->open($host, DriverType::Terminal);

        $refused = $this->assertThrowsAccountWriterTaken(fn () => $this->open($host, DriverType::Headless));

        $this->assertSame($alone->sessionId, $refused->ownerSessionId);
    }

    private function open(EnrolledHost $host, DriverType $driverType): OpenedRuntime
    {
        return $this->asOwner(new OpenAgentRuntimeCommand(
            $this->agent()->id,
            $host->hostId,
            self::FOLDER,
            'example',
            '1.0.0',
            'echo',
            $driverType,
            'echo-small',
        ));
    }

    /**
     * @param  callable(): mixed  $start
     */
    private function assertThrowsAccountWriterTaken(callable $start): AccountWriterTaken
    {
        try {
            $start();
        } catch (AccountWriterTaken $refused) {
            return $refused;
        }

        $this->fail('The second writer on the account was not refused.');
    }

    private function registerFamily(): void
    {
        $registry = $this->app->make(DriverCatalogueContract::class);
        $this->assertInstanceOf(DriverCatalogue::class, $registry);
        $headless = $registry->forKey(DriverKey::from('claude-code-headless'))->descriptor();
        $claude = $registry->family(DefaultDrivers::CLAUDE_CODE);
        $registry->registerFamily(
            new DriverFamily('example', 'Example', ProviderKey::from('example'), 'echo', $claude->isolatesHooksPerSession, []),
        );

        foreach ([
            ['example/echo-headless', DriverType::Headless, AcmeReaderCapabilities::class],
            ['example/echo-terminal', DriverType::Terminal, RunsAloneCapabilities::class],
        ] as [$key, $driverType, $capabilities]) {
            $registry->register(new DriverRegistration(
                DriverKey::from($key),
                'example',
                $driverType,
                'Echo',
                [],
                $headless->hookProtocol,
                $headless->accountProtocol,
                $headless->skillProtocol,
                $capabilities,
                [],
            ));
        }
    }
}
