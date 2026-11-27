<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Setup;

use App\Accounts\Contracts\AccountSettingsFiller;
use App\Accounts\Contracts\SignInProtocol;
use App\Accounts\Enums\SignInMethod;
use App\Agents\Drivers\Contracts\DriverAdapter;
use App\Agents\Drivers\Contracts\DriverIsolation;
use App\Agents\Drivers\Contracts\PinnedBuilds;
use App\Agents\Drivers\Contracts\TurnResult;
use App\Agents\Drivers\Enums\ExecutablePlace;
use App\Agents\Drivers\Enums\IsolationPlatform;
use App\Agents\Drivers\Hooks\HookReplies;
use App\Agents\Exceptions\BuildNotPinned;
use App\Agents\Exceptions\ProfileRefused;
use App\Agents\SignInEgress;
use App\Agents\Values\BoundaryMechanisms;
use App\Agents\Values\SignInFolder;
use App\Agents\Values\SignInReport;
use App\Files\Contracts\Files;
use App\Files\ManifestMount;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\RestartPolicy;
use App\Hosts\Protocol\HostProcessType;
use App\Skills\Contracts\DriverSkills;
use App\Terminals\KeyScripts\KeyScript;
use App\Terminals\Screens\ScreenLayout;
use App\Values\DriverStart;
use App\Values\EnvironmentAddition;
use App\Values\HostProcessPlan;
use App\Values\PlanAddition;
use Illuminate\Contracts\Container\Container;

/**
 * How the journal starts one driver, assembled from the parts its setup declares: each part is built by the container
 * only when its condition holds for the start.
 */
final readonly class DriverProfile
{
    public function __construct(
        private DriverSetup $setup,
        private Container $container,
        private PinnedBuilds $builds,
        private HookReplies $replies,
        private Files $files,
        private SignInEgress $egress,
    ) {}

    public function family(): string
    {
        return $this->setup->family;
    }

    public function build(): string
    {
        return $this->builds->versionOf($this->setup->family);
    }

    /**
     * The image folder the driver's image is built from.
     */
    public function image(): DriverImage
    {
        return $this->setup->image;
    }

    /**
     * @throws BuildNotPinned
     */
    public function assertPinnedBuild(string $printed): void
    {
        if (! $this->setup->versionProbe->line->accepts($printed, $this->build())) {
            throw BuildNotPinned::of($this->setup->driver, trim($printed), $this->build());
        }
    }

    /**
     * The plan of a terminal start or of one turn, from the arguments and the parts that apply to it.
     *
     * @throws ProfileRefused
     */
    public function startPlan(DriverStart $start): HostProcessPlan
    {
        if ($start->model === null || $start->effort === null) {
            throw ProfileRefused::withoutModelOrEffort($this->family());
        }

        foreach ($this->setup->refusals as $refusal) {
            $refusal->assertAllows($start);
        }

        $environment = $this->environmentOf($start);
        $plan = $this->planOf($start);
        $isTerminal = ! $start->isTurn();
        $arguments = $this->container->make($this->setup->arguments);
        $replies = $this->replies->filesFor($this->setup->hookAdapter, $start->offlineReply);

        return new HostProcessPlan(
            purpose: $isTerminal ? HostProcessPurpose::AgentTerminal : HostProcessPurpose::AgentTurn,
            type: $start->type,
            restart: $isTerminal ? RestartPolicy::OnCrash : RestartPolicy::Never,
            argv: $this->placed($arguments->build($start), $start->executablePlace),
            environment: $environment->variables,
            folder: $start->workFolder,
            files: [...$plan->files, ...$replies, ...$start->skillFiles],
            folders: $environment->folders,
            container: $start->container?->manifest,
            inherit: $this->inheritedOn($environment->inherited, $start->executablePlace),
            sideSockets: $plan->sideSockets,
            readFiles: $environment->readFiles,
            shieldRules: $isTerminal ? $this->layout()->shieldRules() : [],
            restartArgv: $plan->restartWhenFile === null
                ? []
                : $this->placed($arguments->build($start->resumed()), $start->executablePlace),
            restartWhenFile: $plan->restartWhenFile,
            keptFiles: $plan->keptFiles,
        );
    }

    /**
     * Whether the driver runs an account's headless turns on one owner process its runtimes share.
     */
    public function hasAccountOwner(): bool
    {
        return $this->setup->headlessTurns->isOnAccountOwner();
    }

    /**
     * The plan of the process that runs every headless turn of the start's account, in the start's environment.
     *
     * @throws ProfileRefused
     */
    public function ownerPlan(DriverStart $start): HostProcessPlan
    {
        foreach ($this->setup->refusals as $refusal) {
            $refusal->assertAllows($start);
        }

        $environment = $this->environmentOf($start);

        return new HostProcessPlan(
            purpose: HostProcessPurpose::AccountOwner,
            type: HostProcessType::Pipe,
            restart: RestartPolicy::Never,
            argv: $this->placed($this->setup->headlessTurns->ownerArgv, $start->executablePlace),
            environment: $environment->variables,
            folder: $start->workFolder,
            files: $this->planOf($start)->files,
            container: $start->container?->manifest->onPipesTakingInput(),
            folders: $environment->folders,
            inherit: $this->inheritedOn($environment->inherited, $start->executablePlace),
            readFiles: $environment->readFiles,
        );
    }

    public function versionProbe(string $workFolder, ExecutablePlace $place): HostProcessPlan
    {
        return new HostProcessPlan(
            purpose: HostProcessPurpose::BuildProbe,
            type: HostProcessType::Pipe,
            restart: RestartPolicy::Never,
            argv: $this->placed($this->setup->versionProbe->argv, $place),
            environment: [],
            folder: $workFolder,
            inherit: $this->inheritedOn($this->setup->versionProbe->inherited, $place),
        );
    }

    /**
     * The short process that prints whether the start's account is signed in, in the start's own environment and with
     * its files, so a container mounts for it what it mounts for the start.
     *
     * @throws ProfileRefused
     */
    public function signInProbe(DriverStart $start): HostProcessPlan
    {
        if ($start->account === null) {
            throw ProfileRefused::unresolvedSetting('no account to check the sign-in of');
        }

        foreach ($this->setup->signInRefusals as $refusal) {
            $refusal->assertAllows($start);
        }

        $environment = $this->environmentOf($start);

        return new HostProcessPlan(
            purpose: HostProcessPurpose::SignInProbe,
            type: HostProcessType::Pipe,
            restart: RestartPolicy::Never,
            argv: $this->placed($this->setup->signInProbe, $start->executablePlace),
            environment: $environment->variables,
            folder: $start->workFolder,
            files: $this->planOf($start)->files,
            container: $start->container?->manifest->onPipes(),
            folders: $environment->folders,
            inherit: $this->inheritedOn($environment->inherited, $start->executablePlace),
            readFiles: $environment->readFiles,
        );
    }

    /**
     * The name a connected machine's installer seals this driver's driver under, as plans name it to that host.
     */
    public function executableHostName(): string
    {
        return strtoupper(str_replace('-', '_', $this->setup->family)).'_EXECUTABLE';
    }

    public function hasAcceptedSignIn(string $printed, string $accountFolder): bool
    {
        return $this->signInReport($printed, null, SignInFolder::named($accountFolder))->isSignedIn;
    }

    /**
     * This driver's driver as the sign-in runner runs it, by the program its setup names; its status command
     * is the host probe's sign-in command without its driver.
     */
    public function signInDriver(): SignInDriver
    {
        return new SignInDriver(
            $this,
            $this->setup->signIn,
            array_slice($this->setup->signInProbe, 1),
            $this->setup->signIn->executable,
            $this->container,
            $this->files,
            $this->egress,
        );
    }

    /**
     * The mounts this driver adds to its contained session: plan files where it reads them, and its scratch folders.
     *
     * @return list<ManifestMount>
     */
    public function containerMounts(): array
    {
        return $this->setup->containerMounts;
    }

    /**
     * What fills this driver's account start settings.
     */
    public function accountSettings(): AccountSettingsFiller
    {
        return $this->container->make($this->setup->accountSettings);
    }

    /**
     * What writes a session's skills where this driver reads them.
     */
    public function skills(): DriverSkills
    {
        return $this->container->make($this->setup->skills);
    }

    /**
     * What this driver applies on each platform before its tools run.
     */
    public function isolation(): DriverIsolation
    {
        return $this->container->make($this->setup->isolation);
    }

    /**
     * How this driver keeps its tools from each boundary item on the platform.
     */
    public function mechanismsOn(IsolationPlatform $platform): BoundaryMechanisms
    {
        return $this->isolation()->mechanismsOn($platform);
    }

    /**
     * What reads this driver's native hook payloads and answers them.
     */
    public function hookAdapter(): DriverAdapter
    {
        return $this->container->make($this->setup->hookAdapter);
    }

    /**
     * The protocol of this driver that signs in by the method; none when the driver offers no such sign-in.
     *
     * @return class-string<SignInProtocol>|null
     */
    public function signInProtocolBy(SignInMethod $method): string|null
    {
        return array_find($this->setup->signIn->methods, fn (string $protocol) => $protocol::method() === $method);
    }

    /**
     * What this driver's sign-in status command printed about an account folder.
     */
    public function signInReport(string $printed, int|null $exitCode, SignInFolder $folder): SignInReport
    {
        return $this->container->make($this->setup->signInReader)($printed, $exitCode, $folder);
    }

    public function layout(): ScreenLayout
    {
        return $this->container->make($this->setup->layout)();
    }

    /**
     * @return list<KeyScript>
     */
    public function keyScripts(): array
    {
        return array_map(fn (string $script) => $this->container->make($script)(), $this->setup->keyScripts);
    }

    public function turnResult(string $processId): TurnResult
    {
        return $this->container->make($this->setup->headlessTurns->turnResults($this->setup->family))($processId);
    }

    private function environmentOf(DriverStart $start): EnvironmentAddition
    {
        $addition = new EnvironmentAddition();

        foreach ($this->setup->environment as $part) {
            if ($part->appliesTo($start)) {
                $addition = $addition->with($part->environmentFor($start, $this->container));
            }
        }

        return $addition;
    }

    private function planOf(DriverStart $start): PlanAddition
    {
        $addition = new PlanAddition();

        foreach ($this->setup->plan as $part) {
            if ($part->appliesTo($start)) {
                $addition = $addition->with($part->planFor($start, $this->container));
            }
        }

        return $addition;
    }

    /**
     * The host variables a process takes on: none in the agent image, where the host's own would only leak in.
     *
     * @param  list<string>  $inherited
     * @return list<string>
     */
    private function inheritedOn(array $inherited, ExecutablePlace $place): array
    {
        if ($place === ExecutablePlace::Image) {
            return [];
        }

        return $inherited;
    }

    /**
     * The argv with its driver named as the host must open it: a sealed driver by its sealed name, a driver in the agent
     * image by its plain name on the image's PATH, and one on the host as its setup names it.
     *
     * @param  list<string>  $argv
     * @return list<string>
     */
    private function placed(array $argv, ExecutablePlace $place): array
    {
        return match ($place) {
            ExecutablePlace::Host => $argv,
            ExecutablePlace::Sealed => [
                '{host:'.$this->executableHostName().'}',
                ...array_slice($argv, 1),
            ],
            ExecutablePlace::Image => [
                $this->setup->driver,
                ...array_slice($argv, 1),
            ],
        };
    }
}
