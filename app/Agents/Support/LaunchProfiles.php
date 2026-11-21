<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Contracts\HostCapabilities;
use App\Agents\Enums\AccountModeType;
use App\Agents\Enums\ExecutionModeType;
use App\Agents\Enums\HostCapabilityType;
use App\Agents\Enums\LaunchProfileType;
use App\Agents\Values\SelectedAccount;
use App\Drivers\Enums\HookDriver;

/**
 * Which launch profile a contained session starts with: a signed-in start uses the protected-account profile once its
 * driver's account isolation is proven, or while the trial names that driver; every other start the standard one.
 */
final readonly class LaunchProfiles
{
    /**
     * @param  list<HookDriver>  $trialDrivers
     */
    public function __construct(
        private ArrangementSetting $arrangement,
        private HostCapabilities $capabilities,
        private array $trialDrivers,
    ) {}

    /**
     * The drivers a comma list names, such as claude-code,codex.
     *
     * @return list<HookDriver>
     */
    public static function trialOf(string $drivers): array
    {
        return array_values(array_map(
            HookDriver::from(...),
            array_filter(array_map(trim(...), explode(',', $drivers))),
        ));
    }

    public function for(HookDriver $driver, SelectedAccount|null $account): LaunchProfileType
    {
        if ($account === null || ! $this->arrangement->arrangement->isContained()) {
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
