<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Accounts\Values\AccountLabel;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Values\RuntimeIntent;
use App\Hosts\Contracts\DockerImageVerifier;
use App\Hosts\Contracts\HostDriverImages;
use App\Hosts\EnrolledHost;
use App\Models\Accounts\Account;
use App\Models\Accounts\ActiveAccount;
use App\Models\Agents\AgentSession;
use App\Models\Projects\DriverImageRecipeRecord;
use App\Models\Projects\Host;
use App\Models\Projects\HostDriverImage;
use App\Models\Sessions\SessionProcess;
use App\Projects\Commands\EnrollHost\EnrollHostCommand;
use App\Projects\Commands\RecordHostCallAnswered\RecordHostCallAnsweredCommand;
use App\Projects\Enums\ArrangementType;
use App\Sessions\AgentRuntimes;
use App\Sessions\OpenedRuntime;
use Closure;
use Illuminate\Contracts\Config\Repository;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\VerifiedTestHostImage;
use Tests\Support\Agents\TestAgent;
use Tests\Support\Seeding\Exceptions\FixtureRefused;

/**
 * The runtimes a test's agents run in: a synthetic runtime for an agent whose commands only need one open, or a real
 * one an agent opens in its scope on a host the journal enrolled, as the owner opens one.
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
     * @var array<string, TestAgent> each agent's scope, kept so what it opened carries on
     */
    private array $agentScopes = [];

    /**
     * An open headless runtime for the named agent's one session, or for this session, so a command that needs a
     * runtime to wake has one.
     */
    public function syntheticRuntime(string|AgentSession $agent): self
    {
        $intent = new RuntimeIntent(
            $this->enrolledHost()->hostId,
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
        // A contained host runs the mock agent image, which this journal's image record verifies.
        $this->app->instance(DockerImageVerifier::class, new VerifiedTestHostImage($this->app->make(Repository::class)));

        return $this;
    }

    /**
     * The contained host's driver images, one per deployed recipe, built, allowed and checked as its runner would
     * leave them, so a start on it passes the image gate without a runner; a test of the build itself drives the
     * host's answers instead.
     */
    public function readyDriverImagesOn(string $host): self
    {
        $box = Host::query()->findOrFail($this->hostCalled($host)->hostId);
        $this->service(HostDriverImages::class)->reserveAll($box);

        foreach (HostDriverImage::findPendingOn($box->id) as $number => $image) {
            $image->startAttempt("ready-build-{$number}");
            $image->built('sha256:'.hash('sha256', "driver image {$image->driver_image_recipe_id}"));
            $image->orderedIn("ready-allow-{$number}");
            $image->acknowledged();
            $image->markChecksSent("ready-checks-{$number}");
            $image->checked();
        }

        return $this;
    }

    /**
     * The contained host's driver images readied as the recorded machine had them: each recipe's image is the one the
     * recording names for its folder, so the host's played daemon is asked about the images it recorded.
     *
     * @param  array<string, string>  $imagesByFolder
     */
    public function readyRecordedDriverImagesOn(string $host, array $imagesByFolder): self
    {
        $box = Host::query()->findOrFail($this->hostCalled($host)->hostId);
        $this->service(HostDriverImages::class)->reserveAll($box);

        foreach (HostDriverImage::findPendingOn($box->id) as $number => $image) {
            $folder = DriverImageRecipeRecord::query()->findOrFail($image->driver_image_recipe_id)->folder;
            $image->startAttempt("recorded-build-{$number}");
            $image->built($imagesByFolder[$folder] ?? throw FixtureRefused::missingAlias('recorded image', $folder, 'The recording'));
            $image->orderedIn("recorded-allow-{$number}");
            $image->acknowledged();
            $image->markChecksSent("recorded-checks-{$number}");
            $image->checked();
        }

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
     * The agent of this name, handed to the scope to open its runtime, prove its start and reach its session; the
     * same agent keeps what it opened from one scope to the next.
     *
     * @param  Closure(TestAgent): mixed  $scope
     */
    public function withAgent(string $name, Closure $scope): self
    {
        $this->agentCalled($name);
        $scope($this->agentScopes[$name] ??= new TestAgent($this, $name));

        return $this;
    }

    /**
     * The runtime the agent of this name opened in its scope, for a command that names it by its ids.
     */
    public function openedRuntimeOf(string $agent): OpenedRuntime
    {
        $scope = $this->agentScopes[$agent] ?? throw FixtureRefused::missingAlias('opened runtime', $agent, self::OWNER);

        return $scope->runtime();
    }
}
