<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Commands\Agents\OpenAgentRuntime\OpenAgentRuntimeCommand;
use App\Commands\Projects\EnrollHost\EnrollHostCommand;
use App\Enums\Drivers\DriverType;
use App\Support\AgentRuntimes;
use App\Support\EnrolledHost;
use App\Support\OpenedRuntime;
use App\Values\RuntimeIntent;
use Illuminate\Support\Str;

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
     * An open headless runtime for the agent's one session, so a command that needs a runtime to wake has one.
     */
    public function syntheticRuntime(string $agent): self
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
        $this->app->make(AgentRuntimes::class)->open($this->sessionOf($agent), $intent, 'start-token');

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

    public function hostCalled(string $name): EnrolledHost
    {
        return $this->hosts[$name] ?? throw FixtureRefused::missingAlias('host', $name, self::OWNER);
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
