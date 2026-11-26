<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Setup;

use App\Accounts\Contracts\AccountSettingsFiller;
use App\Agents\Drivers\Contracts\DriverAdapter;
use App\Agents\Drivers\Contracts\DriverKeyScripts;
use App\Agents\Drivers\Contracts\DriverLayout;
use App\Agents\Drivers\Setup\Contracts\SignInReader;
use App\Agents\Exceptions\ProfileRefused;
use App\Processes\ArgumentBuilder;
use App\Processes\Contracts\Condition;
use App\Skills\Contracts\DriverSkills;
use App\Values\DriverStart;
use Closure;

/**
 * One driver declared from its parts: the parts every driver has, named in of(), then the starts it refuses and the
 * parts of its environment and start plan, each applying while its condition holds.
 */
final readonly class DriverSetup
{
    /**
     * @param  class-string<ArgumentBuilder<DriverStart>>  $arguments
     * @param  non-empty-list<string>  $signInProbe
     * @param  class-string<SignInReader>  $signInReader
     * @param  class-string<DriverLayout>  $layout
     * @param  class-string<DriverKeyScripts>  $keyScripts
     * @param  class-string<AccountSettingsFiller>  $accountSettings
     * @param  class-string<DriverSkills>  $skills
     * @param  class-string<DriverAdapter>  $hookAdapter
     * @param  list<StartRefusal>  $refusals
     * @param  list<StartRefusal>  $signInRefusals
     * @param  list<ConditionalPart>  $environment
     * @param  list<ConditionalPart>  $plan
     */
    private function __construct(
        public string $family,
        public string $driver,
        public string $arguments,
        public VersionProbe $versionProbe,
        public array $signInProbe,
        public string $signInReader,
        public string $layout,
        public string $keyScripts,
        public HeadlessTurns $headlessTurns,
        public SignInSetup $signIn,
        public string $accountSettings,
        public string $skills,
        public string $hookAdapter,
        public array $refusals = [],
        public array $signInRefusals = [],
        public array $environment = [],
        public array $plan = [],
    ) {}

    /**
     * @param  class-string<ArgumentBuilder<DriverStart>>  $arguments
     * @param  non-empty-list<string>  $signInProbe
     * @param  class-string<SignInReader>  $signInReader
     * @param  class-string<DriverLayout>  $layout
     * @param  class-string<DriverKeyScripts>  $keyScripts
     * @param  class-string<AccountSettingsFiller>  $accountSettings
     * @param  class-string<DriverSkills>  $skills
     * @param  class-string<DriverAdapter>  $hookAdapter
     */
    public static function of(
        string $family,
        string $driver,
        string $arguments,
        VersionProbe $versionProbe,
        array $signInProbe,
        string $signInReader,
        string $layout,
        string $keyScripts,
        HeadlessTurns $headlessTurns,
        SignInSetup $signIn,
        string $accountSettings,
        string $skills,
        string $hookAdapter,
    ): self {
        return new self(
            $family,
            $driver,
            $arguments,
            $versionProbe,
            $signInProbe,
            $signInReader,
            $layout,
            $keyScripts,
            $headlessTurns,
            $signIn,
            $accountSettings,
            $skills,
            $hookAdapter,
        );
    }

    /**
     * The same setup for another driver family, such as a family a module adds that runs this driver's program.
     */
    public function forFamily(string $family): self
    {
        return new self(
            $family,
            $this->driver,
            $this->arguments,
            $this->versionProbe,
            $this->signInProbe,
            $this->signInReader,
            $this->layout,
            $this->keyScripts,
            $this->headlessTurns,
            $this->signIn,
            $this->accountSettings,
            $this->skills,
            $this->hookAdapter,
            $this->refusals,
            $this->signInRefusals,
            $this->environment,
            $this->plan,
        );
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
     * The parts of the environment a start and its sign-in probe share, in the order they add.
     */
    public function environment(ConditionalPart ...$parts): self
    {
        return clone ($this, ['environment' => [...$this->environment, ...array_values($parts)]]);
    }

    /**
     * The parts of the start plan, in the order they add.
     */
    public function startPlan(ConditionalPart ...$parts): self
    {
        return clone ($this, ['plan' => [...$this->plan, ...array_values($parts)]]);
    }
}
