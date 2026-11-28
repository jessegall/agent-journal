<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Setup;

use App\Accounts\Contracts\AccountSettingsFiller;
use App\Agents\Drivers\Contracts\DriverAdapter;
use App\Agents\Drivers\Contracts\DriverKeyScript;
use App\Agents\Drivers\Contracts\DriverLayout;
use App\Agents\Drivers\Parts\ContainerAccountHome;
use App\Agents\Drivers\Parts\StartReference;
use App\Agents\Drivers\Setup\Contracts\SignInReader;
use App\Agents\Drivers\StartConditions\AccountStart;
use App\Agents\Drivers\StartConditions\ContainedStart;
use App\Agents\Exceptions\DriverSetupInvalid;
use App\Agents\Exceptions\ProfileRefused;
use App\Files\ManifestMount;
use App\Processes\ArgumentBuilder;
use App\Processes\Contracts\Condition;
use App\Skills\Contracts\DriverSkills;
use App\Support\MountRules;
use App\Values\DriverStart;
use Closure;

/**
 * A driver declared one part to a call, starting from what every driver shares: its account's
 * home and its start's reference in a contained start. build() refuses a declaration that misses a part every driver
 * needs, naming it.
 */
final readonly class DefaultDriverSetup
{
    /**
     * @param  class-string<ArgumentBuilder<DriverStart>>|null  $arguments
     * @param  non-empty-list<string>|null  $signInProbe
     * @param  class-string<SignInReader>|null  $signInReader
     * @param  class-string<DriverLayout>|null  $layout
     * @param  list<class-string<DriverKeyScript>>|null  $keyScripts
     * @param  class-string<AccountSettingsFiller>|null  $accountSettings
     * @param  class-string<DriverSkills>|null  $skills
     * @param  class-string<DriverAdapter>|null  $hookAdapter
     * @param  list<ConditionalPart>  $journalServer  the part that gives the driver the journal's server, when it has one
     * @param  list<StartRefusal>  $refusals
     * @param  list<StartRefusal>  $signInRefusals
     * @param  list<ConditionalPart>  $parts
     * @param  list<ManifestMount>  $containerMounts
     */
    private function __construct(
        private string $family,
        private string|null $driver = null,
        private DriverImage|null $image = null,
        private string|null $arguments = null,
        private VersionProbe|null $versionProbe = null,
        private array|null $signInProbe = null,
        private string|null $signInReader = null,
        private string|null $layout = null,
        private array|null $keyScripts = null,
        private HeadlessTurns|null $headlessTurns = null,
        private SignInSetup|null $signIn = null,
        private string|null $accountSettings = null,
        private string|null $skills = null,
        private string|null $hookAdapter = null,
        private array $journalServer = [],
        private array $refusals = [],
        private array $signInRefusals = [],
        private array $parts = [],
        private array $containerMounts = [],
    ) {}

    public static function for(string $family): self
    {
        return new self($family, parts: [
            ConditionalPart::forAccount(new ContainedStart(), ContainerAccountHome::class),
            ConditionalPart::forAccount(new AccountStart(), StartReference::class),
        ]);
    }

    public function driver(string $driver): self
    {
        return clone ($this, ['driver' => $driver]);
    }

    public function image(DriverImage $image): self
    {
        return clone ($this, ['image' => $image]);
    }

    /**
     * @param  class-string<ArgumentBuilder<DriverStart>>  $arguments
     */
    public function arguments(string $arguments): self
    {
        return clone ($this, ['arguments' => $arguments]);
    }

    public function version(VersionProbe $probe): self
    {
        return clone ($this, ['versionProbe' => $probe]);
    }

    /**
     * @param  non-empty-list<string>  $argv
     * @param  class-string<SignInReader>  $reader
     */
    public function signInProbe(array $argv, string $reader): self
    {
        return clone ($this, ['signInProbe' => $argv, 'signInReader' => $reader]);
    }

    /**
     * @param  class-string<DriverLayout>  $layout
     */
    public function layout(string $layout): self
    {
        return clone ($this, ['layout' => $layout]);
    }

    /**
     * @param  list<class-string<DriverKeyScript>>  $scripts
     */
    public function keyScripts(array $scripts): self
    {
        return clone ($this, ['keyScripts' => $scripts]);
    }

    public function headlessTurns(HeadlessTurns $turns): self
    {
        return clone ($this, ['headlessTurns' => $turns]);
    }

    public function signIn(SignInSetup $setup): self
    {
        return clone ($this, ['signIn' => $setup]);
    }

    /**
     * @param  class-string<AccountSettingsFiller>  $settings
     */
    public function accountSettings(string $settings): self
    {
        return clone ($this, ['accountSettings' => $settings]);
    }

    /**
     * @param  class-string<DriverSkills>  $skills
     */
    public function skills(string $skills): self
    {
        return clone ($this, ['skills' => $skills]);
    }

    /**
     * @param  class-string<DriverAdapter>  $adapter
     */
    public function hookAdapter(string $adapter): self
    {
        return clone ($this, ['hookAdapter' => $adapter]);
    }

    /**
     * How the driver is given the journal's MCP server on a start; a driver whose image holds its server's
     * configuration declares none.
     */
    public function journalServer(ConditionalPart $part): self
    {
        return clone ($this, ['journalServer' => [$part]]);
    }

    /**
     * Parts each start takes while its condition holds, environment and plan parts alike, in the order they add.
     */
    public function perStart(ConditionalPart ...$parts): self
    {
        return clone ($this, ['parts' => [...$this->parts, ...array_values($parts)]]);
    }

    /**
     * Parts only a start outside a container takes, each while its condition holds too.
     */
    public function local(ConditionalPart ...$parts): self
    {
        $local = array_map(fn (ConditionalPart $part) => $part->outsideContainers(), array_values($parts));

        return clone ($this, ['parts' => [...$this->parts, ...$local]]);
    }

    /**
     * A start the driver never runs while the condition holds.
     *
     * @param  Condition<DriverStart>  $condition
     * @param  Closure(): ProfileRefused  $refusal
     */
    public function refusedWhen(Condition $condition, Closure $refusal): self
    {
        return clone ($this, ['refusals' => [...$this->refusals, new StartRefusal($condition, $refusal)]]);
    }

    /**
     * A sign-in probe the driver never runs while the condition holds.
     *
     * @param  Condition<DriverStart>  $condition
     * @param  Closure(): ProfileRefused  $refusal
     */
    public function signInRefusedWhen(Condition $condition, Closure $refusal): self
    {
        return clone ($this, ['signInRefusals' => [...$this->signInRefusals, new StartRefusal($condition, $refusal)]]);
    }

    /**
     * A folder of the driver's account where it keeps only its own scratch, held in its container's memory so the
     * scratch never reaches the account folder.
     */
    public function keepsScratchIn(string $accountFolder): self
    {
        $scratch = ManifestMount::scratch(MountRules::ACCOUNT_TARGET.'/'.$accountFolder);

        return clone ($this, ['containerMounts' => [...$this->containerMounts, $scratch]]);
    }

    /**
     * The declared driver; one missing a part every driver needs is refused, naming that part.
     *
     * @throws DriverSetupInvalid
     */
    public function build(): DriverSetup
    {
        $addsToEnvironment = fn (ConditionalPart $part) => $part->addsToEnvironment();
        $environment = array_values(array_filter($this->parts, $addsToEnvironment));
        $plan = array_values(array_filter($this->parts, fn (ConditionalPart $part) => ! $addsToEnvironment($part)));

        return new DriverSetup(
            $this->family,
            $this->required($this->driver, 'driver'),
            $this->required($this->image, 'image'),
            $this->required($this->arguments, 'arguments'),
            $this->required($this->versionProbe, 'version'),
            $this->required($this->signInProbe, 'signInProbe'),
            $this->required($this->signInReader, 'signInProbe'),
            $this->required($this->layout, 'layout'),
            $this->required($this->keyScripts, 'keyScripts'),
            $this->required($this->headlessTurns, 'headlessTurns'),
            $this->required($this->signIn, 'signIn'),
            $this->required($this->accountSettings, 'accountSettings'),
            $this->required($this->skills, 'skills'),
            $this->required($this->hookAdapter, 'hookAdapter'),
            $this->refusals,
            $this->signInRefusals,
            $environment,
            [
                ...$this->journalServer,
                ...$plan,
            ],
            $this->containerMounts,
        );
    }

    /**
     * The part a declaration gave, or the refusal that names it as missing.
     *
     * @template TPart
     *
     * @param  TPart|null  $part
     * @return TPart
     *
     * @throws DriverSetupInvalid
     */
    private function required(mixed $part, string $name): mixed
    {
        return $part ?? throw DriverSetupInvalid::missingPart($this->family, $name);
    }
}
