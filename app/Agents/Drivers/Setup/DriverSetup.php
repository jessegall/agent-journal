<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Setup;

use App\Accounts\Contracts\AccountSettingsFiller;
use App\Agents\Drivers\Contracts\DriverAdapter;
use App\Agents\Drivers\Contracts\DriverKeyScript;
use App\Agents\Drivers\Contracts\DriverLayout;
use App\Agents\Drivers\Setup\Contracts\SignInReader;
use App\Files\ManifestMount;
use App\Processes\ArgumentBuilder;
use App\Skills\Contracts\DriverSkills;
use App\Values\DriverStart;

/**
 * One driver as its declaration built it (DefaultDriverSetup): the parts every driver has, the starts it refuses,
 * its image, and the parts of its environment and start plan, each applying while its condition holds.
 */
final readonly class DriverSetup
{
    /**
     * @param  class-string<ArgumentBuilder<DriverStart>>  $arguments
     * @param  non-empty-list<string>  $signInProbe
     * @param  class-string<SignInReader>  $signInReader
     * @param  class-string<DriverLayout>  $layout
     * @param  list<class-string<DriverKeyScript>>  $keyScripts
     * @param  class-string<AccountSettingsFiller>  $accountSettings
     * @param  class-string<DriverSkills>  $skills
     * @param  class-string<DriverAdapter>  $hookAdapter
     * @param  list<StartRefusal>  $refusals
     * @param  list<StartRefusal>  $signInRefusals
     * @param  list<ConditionalPart>  $environment
     * @param  list<ConditionalPart>  $plan
     * @param  list<ManifestMount>  $containerMounts
     */
    public function __construct(
        public string $family,
        public string $driver,
        public DriverImage $image,
        public string $arguments,
        public VersionProbe $versionProbe,
        public array $signInProbe,
        public string $signInReader,
        public string $layout,
        public array $keyScripts,
        public HeadlessTurns $headlessTurns,
        public SignInSetup $signIn,
        public string $accountSettings,
        public string $skills,
        public string $hookAdapter,
        public array $refusals,
        public array $signInRefusals,
        public array $environment,
        public array $plan,
        public array $containerMounts,
    ) {}

    /**
     * The same setup for another driver family, such as a family a module adds that runs this driver's executable:
     * the same image, parts and refusals.
     */
    public function forFamily(string $family): self
    {
        return clone ($this, ['family' => $family]);
    }
}
