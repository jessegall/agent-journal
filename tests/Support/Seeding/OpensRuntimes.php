<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Accounts\Values\AccountLabel;
use App\Agents\Commands\OpenAgentRuntime\OpenAgentRuntimeCommand;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Drivers\Setup\DriverProfiles;
use App\Agents\Values\RuntimeIntent;
use App\Hosts\EnrolledHost;
use App\Models\Accounts\Account;
use App\Models\Accounts\ActiveAccount;
use App\Models\Agents\AgentSession;
use App\Models\Sessions\SessionProcess;
use App\Projects\Commands\EnrollHost\EnrollHostCommand;
use App\Projects\Commands\RecordHostCallAnswered\RecordHostCallAnsweredCommand;
use App\Projects\Enums\ArrangementType;
use App\Sessions\AgentRuntimes;
use App\Sessions\OpenedRuntime;
use Illuminate\Support\Str;
use Tests\Support\Seeding\Exceptions\FixtureRefused;

/**
 * The runtimes a test's agents run in: a stand-in runtime for an agent whose commands only need one open, or a real
 * one opened on a host the journal enrolled, as the owner opens one.
 */
trait OpensRuntimes
{
    /**
     * @var array<string, EnrolledHost>
     */
    private array $hosts = [];

    /**
     * The account chosen for each driver, by driver.
     *
     * @var array<string, Account>
     */
    private array $chosenAccounts = [];

    /**
     * An open headless runtime for the named agent's one session, or for this session, so a command that needs a
     * runtime to wake has one.
     */
    public function syntheticRuntime(string|AgentSession $agent): self
    {
        $intent = new RuntimeIntent(
            'host-1',
            base_path(),
            'claude-code',
            '1.0.0',
            'default',
            DriverType::Headless,
            null,
            null,
            null,
        );
        $this->app->make(AgentRuntimes::class)->open(
            is_string($agent) ? $this->sessionOf($agent) : $agent,
            $intent,
            'start-token',
        );

        return $this;
    }

    /**
     * A contained host enrolled under the name, serving the folders, as a server's installation enrols.
     *
     * @param  list<string>  $folders
     */
    public function enrollContainedHost(string $name, array $folders): self
    {
        if (array_key_exists($name, $this->hosts)) {
            throw FixtureRefused::occupiedAlias($name, 'host');
        }

        $this->hosts[$name] = $this->asSystem(new EnrollHostCommand($name, $folders, ArrangementType::Contained));

        return $this;
    }

    /**
     * A host enrolled through the real enrollment, allowed into the folders given.
     *
     * @param  list<string>  $folders
     */
    public function enrollHost(string $name, array $folders): self
    {
        if (array_key_exists($name, $this->hosts)) {
            throw FixtureRefused::occupiedAlias($name, 'host');
        }

        $this->hosts[$name] = $this->asSystem(new EnrollHostCommand($name, $folders));

        return $this;
    }

    /**
     * A new host, enrolled under a name of its own in the project folder, for a test that needs any host at all.
     */
    public function enrolledHost(): EnrolledHost
    {
        return $this->asSystem(new EnrollHostCommand('test host '.Str::random(6), [base_path()]));
    }

    /**
     * The journal answered one of the host's calls just now, as it does for a live host, so its next answer is not one
     * the journal records again.
     */
    public function markHostAnswered(EnrolledHost $host): self
    {
        $this->asSystem(new RecordHostCallAnsweredCommand($host->hostId, '/host/heartbeat', []));

        return $this;
    }

    public function hostCalled(string $name): EnrolledHost
    {
        return $this->hosts[$name] ?? throw FixtureRefused::missingAlias('host', $name, self::OWNER);
    }

    /**
     * The session's newest start, read across every agent's starts whoever acts.
     */
    public function startOfSession(string $sessionId): SessionProcess
    {
        return SessionProcess::query()->supervised()->ofSessions([$sessionId])->newestFirst()->firstOrFail();
    }

    /**
     * Whoever acts, the owner as a rule, saves a signed-in account for every driver and chooses it, as on the Accounts
     * page, so the starts that follow run with it.
     */
    public function chooseActiveAccounts(string $folder = '/journal/accounts'): self
    {
        foreach (DefaultDrivers::familyKeys() as $driver) {
            $this->chooseAccountOf($driver, 'Test account', $folder);
        }

        return $this;
    }

    /**
     * The owner saves a signed-in account of the label given for the driver family and chooses it, as on the Accounts
     * page, so the starts of that family run with it.
     */
    public function chooseActiveAccount(string $family, string $label, string $folder = '/journal/accounts'): self
    {
        $owner = $this->ownerUser();
        $this->requests->during(
            fn () => $this->requests->asUser($owner),
            fn () => $this->chooseAccountOf($family, $label, $folder),
        );

        return $this;
    }

    /**
     * The folder a test saves the family's account in: plain letters and digits, as an account folder's name is.
     */
    public static function accountFolderOf(string $folder, string $family): string
    {
        return "{$folder}/".str_replace('-', '', $family);
    }

    private function chooseAccountOf(string $family, string $label, string $folder): void
    {
        $account = Account::create($family, AccountLabel::from($label), self::accountFolderOf($folder, $family));
        ActiveAccount::findLockedFor($family)->select($account);
        $this->chosenAccounts[$family] = $account;
    }

    /**
     * @return array<string, Account>
     */
    public function chosenAccounts(): array
    {
        return $this->chosenAccounts;
    }

    /**
     * The owner opens a headless Codex runtime of the agent on the host, on the pinned build, through the real start
     * path; the test chose the driver's account first.
     */
    public function openCodexRuntimeOn(string $agent, string $host, string $folder, string|null $firstMessage = null): OpenedRuntime
    {
        $build = $this->service(DriverProfiles::class)->ofFamily(DefaultDrivers::CODEX)->build();

        return $this->openRuntimeOn(
            $agent,
            $host,
            $folder,
            DefaultDrivers::CODEX,
            $build,
            'codex',
            model: 'gpt-5.5',
            firstMessage: $firstMessage,
        );
    }

    /**
     * The owner opens the agent's runtime on the host in one of its folders, through the real start path; the test
     * chose the driver's account first.
     */
    public function openRuntimeOn(
        string $agent,
        string $host,
        string $folder,
        string $driver = 'claude-code',
        string $build = '2.1.323',
        string $profile = 'claude',
        DriverType $driverType = DriverType::Headless,
        string|null $model = 'claude-opus-5-5',
        string|null $firstMessage = null,
    ): OpenedRuntime {
        $command = new OpenAgentRuntimeCommand(
            $this->agentCalled($agent)->id,
            $this->hostCalled($host)->hostId,
            $folder,
            $driver,
            $build,
            $profile,
            $driverType,
            $model,
            firstMessage: $firstMessage,
        );

        return $this->asOwner($command);
    }
}
