<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Hosts\HostCapabilities;
use App\Enums\AccountModeType;
use App\Enums\ExecutionModeType;
use App\Enums\HostCapabilityType;
use App\Enums\LaunchProfileType;
use App\Values\SelectedAccount;

/**
 * Which launch profile a contained session starts with: a signed-in start uses the protected-account profile once its
 * driver's account isolation is proven, or while the trial names that driver; every other start the standard one.
 */
final readonly class LaunchProfiles
{
    /**
     * @param  list<string>  $trialDrivers
     */
    public function __construct(
        private ArrangementSetting $arrangement,
        private HostCapabilities $capabilities,
        private array $trialDrivers,
    ) {}

    /**
     * The drivers a comma list names, such as claude-code,codex.
     *
     * @return list<string>
     */
    public static function trialOf(string $drivers): array
    {
        return array_values(array_filter(array_map(trim(...), explode(',', $drivers))));
    }

    public function for(string $driver, SelectedAccount|null $account): LaunchProfileType
    {
        if ($account === null) {
            return LaunchProfileType::Standard;
        }

        return $this->forSignedIn($driver);
    }

    /**
     * The launch profile a signed-in start of the driver uses, which is the one whose protection decides whether the
     * driver may start contained at all.
     */
    public function forSignedIn(string $driver): LaunchProfileType
    {
        if (! $this->arrangement->arrangement->isContained()) {
            return LaunchProfileType::Standard;
        }

        $isolation = $this->capabilities->capability(new HostCapabilityQuery(
            HostCapabilityType::AccountIsolation,
            $driver,
            AccountModeType::Subscription,
            ExecutionModeType::RequiredContainer,
        ));

        return $isolation->isSupported() || in_array($driver, $this->trialDrivers, true)
            ? LaunchProfileType::ProtectedAccount
            : LaunchProfileType::Standard;
    }
}
