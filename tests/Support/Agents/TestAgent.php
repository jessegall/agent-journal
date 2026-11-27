<?php

declare(strict_types=1);

namespace Tests\Support\Agents;

use App\Agents\Commands\CheckDriverBuild\CheckDriverBuildCommand;
use App\Agents\Commands\CheckSignIn\CheckSignInCommand;
use App\Agents\Commands\DeliverAgent\DeliverAgentCommand;
use App\Agents\Commands\OpenAgentRuntime\OpenAgentRuntimeCommand;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\DriverType;
use App\Files\Contracts\Files;
use App\Files\Enums\Permissions;
use App\Files\Enums\Place;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Protocol\HostProcessReportType;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Hosts\HostInstruction;
use App\Models\Hosts\HostProcess;
use App\Models\Projects\HostDriverImage;
use App\Models\Projects\HostDriverImageWait;
use App\Sessions\OpenedRuntime;
use Carbon\CarbonImmutable;
use Closure;
use PHPUnit\Framework\Assert as PHPUnit;
use Tests\Support\Assertions\Assert;
use Tests\Support\Hosts\AccountOwners;
use Tests\Support\Hosts\TestHostProcess;
use Tests\Support\Seeding\Exceptions\FixtureRefused;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent of the test, acted on in its own scope: it opens its runtime on a host, proves its start, names the
 * processes the journal opened for it, takes messages and reaches its session.
 */
final class TestAgent
{
    private OpenedRuntime|null $opened = null;

    public function __construct(private readonly TestJournal $journal, private readonly string $name) {}

    /**
     * The owner opens the agent's runtime on the host in one of its folders, through the real start path; the test
     * chose the driver's account first.
     */
    public function openRuntime(
        string $host,
        string $folder,
        string $driver = 'claude-code',
        string $build = '2.1.323',
        string $profile = 'claude',
        DriverType $driverType = DriverType::Headless,
        string|null $model = 'claude-opus-5-5',
        string|null $firstMessage = null,
    ): self {
        $this->opened = $this->journal->asOwner(new OpenAgentRuntimeCommand(
            $this->journal->agentCalled($this->name)->id,
            $this->journal->hostCalled($host)->hostId,
            $folder,
            $driver,
            $build,
            $profile,
            $driverType,
            $model,
            firstMessage: $firstMessage,
        ));

        return $this;
    }

    /**
     * The owner opens a headless Codex runtime of the agent on the host, on the pinned build, through the real start
     * path; the test chose the driver's account first.
     */
    public function openCodexRuntime(string $host, string $folder, string|null $firstMessage = null): self
    {
        $build = $this->journal->driverProfile(DefaultDrivers::CODEX)->build();

        return $this->openRuntime(
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
     * The journal proves the runtime's start on the running test host: its build probe, then its sign-in probe, run
     * there and are driven until the process the proven start opens is ordered, which the test then calls by the
     * name. An account's owner belongs to the account rather than the runtime, so it is found by the account.
     */
    public function proveStart(HostProcessPurpose $opens, string $name): self
    {
        $runtime = "agents.{$this->name}.runtime";
        $ordered = fn (HostProcessPurpose $purpose) => fn (Assert $journal) => $journal
            ->has("{$runtime}.processes.{$purpose->value}");
        $ownerOrdered = fn (Assert $journal) => $journal
            ->where("{$runtime}.startProven", true)
            ->has("{$runtime}.accountOwner");
        $isOwner = $opens === HostProcessPurpose::AccountOwner;
        $this->awaitProcess(HostProcessPurpose::BuildProbe);
        $this->nameProcess("{$this->name} probe", HostProcessPurpose::BuildProbe)
            ->process("{$this->name} probe", fn (TestHostProcess $probe) => $probe
                ->driveUntil($ordered(HostProcessPurpose::SignInProbe)))
            ->nameProcess("{$this->name} sign-in", HostProcessPurpose::SignInProbe)
            ->process("{$this->name} sign-in", fn (TestHostProcess $signIn) => $signIn
                ->driveUntil($isOwner ? $ownerOrdered : $ordered($opens)));

        if ($isOwner) {
            return $this->callAccountOwner($name);
        }

        return $this->nameProcess($name, $opens);
    }

    /**
     * Waits until the journal opened the runtime a process of the purpose: a contained start opens its build probe
     * only once its host built, allowed and checked the driver image, as the host's answers arrive.
     */
    public function awaitProcess(HostProcessPurpose $purpose, int $seconds = 120): self
    {
        $deadline = microtime(true) + $seconds;
        $opened = fn () => HostProcess::query()
            ->where('agent_runtime_id', $this->runtime()->runtimeId)
            ->where('purpose', $purpose)
            ->exists();

        while (! $opened() && microtime(true) < $deadline) {
            usleep(200_000);
        }

        if (! $opened()) {
            PHPUnit::fail("No {$purpose->value} was opened in {$seconds} seconds.\n".$this->imageReport());
        }

        return $this;
    }

    /**
     * What the driver images and the host instructions stand at, for a start that never reached its probe.
     */
    private function imageReport(): string
    {
        $images = HostDriverImage::query()->orderBy('id')->get()->map(
            fn (HostDriverImage $image) => "image {$image->status->value} failures {$image->failures}: {$image->refusal}",
        );
        $instructions = HostInstruction::query()->orderBy('sequence')->get()->map(
            fn (HostInstruction $instruction) => "{$instruction->type->value} {$instruction->status->value} "
                .($instruction->refusal?->value ?? '').' '.json_encode($instruction->answer?->reason),
        );

        $waits = 'waits '.HostDriverImageWait::query()->count();

        return implode("\n", [...$images->all(), $waits, ...$instructions->all()]);
    }

    /**
     * Names the runtime's newest process of the purpose, one the journal opened itself, so the test can act on it.
     */
    public function nameProcess(string $name, HostProcessPurpose $purpose): self
    {
        $process = HostProcess::query()
            ->where('agent_runtime_id', $this->runtime()->runtimeId)
            ->where('purpose', $purpose)
            ->latest('id')
            ->firstOrFail();
        $this->journal->nameHostProcess($name, $process->id);

        return $this;
    }

    /**
     * The runtime's build probe, which the journal ordered, prints the pinned build, so its sign-in probe is ordered
     * next; both are named for the test as <name>-probe and <name>-sign-in.
     */
    public function passBuildProbe(string $name): self
    {
        $build = $this->journal->driverProfile(DefaultDrivers::CLAUDE_CODE)->build();
        $probe = $this->exitedBuildProbe("{$name}-probe");
        $this->journal->asSystem(new CheckDriverBuildCommand($probe->id, "{$build} (Claude Code)\n"));

        return $this->nameProcess("{$name}-sign-in", HostProcessPurpose::SignInProbe);
    }

    /**
     * The Codex runtime's build probe prints the pinned build, its account holds a sign-in file and its sign-in probe
     * prints a ChatGPT sign-in, so its start is proven; the probes are named <name>-probe and <name>-sign-in.
     */
    public function passCodexProbes(string $name): self
    {
        $build = $this->journal->driverProfile(DefaultDrivers::CODEX)->build();
        $probe = $this->exitedBuildProbe("{$name}-probe");
        $this->journal->asSystem(new CheckDriverBuildCommand($probe->id, "codex-cli {$build}\n"));
        $this->nameProcess("{$name}-sign-in", HostProcessPurpose::SignInProbe);
        $signIn = $this->journal->hostProcessCalled("{$name}-sign-in");
        $files = $this->journal->service(Files::class);
        $folder = $files->pathIn(Place::Accounts, $signIn->sessionProcess()->sole()->directory);
        $files->makeFolder($folder, Permissions::OwnerOnly);
        $files->write($folder->child('auth.json'), '{}', Permissions::OwnerOnly);
        $this->journal->asSystem(new CheckSignInCommand($signIn->id, "Logged in using ChatGPT\n"));

        return $this;
    }

    /**
     * Names the live owner that runs the headless turns of the runtime's account.
     */
    public function callAccountOwner(string $name): self
    {
        $runtime = AgentRuntime::query()->whereKey($this->runtime()->runtimeId)->sole();
        $owner = AccountOwners::liveOwnerOf($runtime)
            ?? throw FixtureRefused::missingAlias('account owner', $this->name, 'The journal');
        $this->journal->nameHostProcess($name, $owner->id);

        return $this;
    }

    /**
     * A process the test named, handed to the scope.
     *
     * @param  Closure(TestHostProcess): mixed  $scope
     */
    public function process(string $name, Closure $scope): self
    {
        $this->journal->hostProcess($name, $scope);

        return $this;
    }

    /**
     * The owner delivers the text to the agent under the delivery key, as the chat delivers a message.
     */
    public function deliver(string $key, string $text): self
    {
        $this->journal->asOwner(DeliverAgentCommand::text(
            $this->journal->agentCalled($this->name)->id,
            $this->newestSession()->id,
            $key,
            $text,
        ));

        return $this;
    }

    /**
     * The agent retires now.
     */
    public function retire(): self
    {
        $this->journal->agentCalled($this->name)->retireAt(CarbonImmutable::now());

        return $this;
    }

    /**
     * The agent's newest session, handed to the scope.
     *
     * @param  Closure(TestSession): mixed  $scope
     */
    public function session(Closure $scope): self
    {
        $scope(new TestSession($this->journal, $this->newestSession()));

        return $this;
    }

    /**
     * The runtime the agent opened in this scope, for a command that names it by its ids.
     */
    public function runtime(): OpenedRuntime
    {
        return $this->opened ?? throw FixtureRefused::missingAlias('opened runtime', $this->name, 'The journal');
    }

    private function newestSession(): AgentSession
    {
        return AgentSession::query()
            ->withoutGlobalScopes()
            ->where('agent_id', $this->journal->agentCalled($this->name)->id)
            ->latest('id')
            ->firstOrFail();
    }

    /**
     * The runtime's build probe, named for the test, run and exited well, as a build is checked only once its probe
     * ended.
     */
    private function exitedBuildProbe(string $name): HostProcess
    {
        $this->nameProcess($name, HostProcessPurpose::BuildProbe);
        $this->journal->hostProcess($name, fn (TestHostProcess $probe) => $probe
            ->report(HostProcessReportType::Running)
            ->report(HostProcessReportType::Exited, 0));

        return $this->journal->hostProcessCalled($name);
    }
}
