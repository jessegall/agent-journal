<?php

declare(strict_types=1);

namespace App\Profiles;

use App\Accounts\Enums\AccountModeType;
use App\Agents\Drivers\Enums\StartProfileType;
use App\Agents\Enums\ExecutionModeType;
use App\Hosts\ArrangementSetting;
use App\Hosts\Contracts\HostCapabilities;
use App\Hosts\HostCapabilityQuery;
use App\Projects\Enums\HostCapabilityType;
use App\Values\SelectedAccount;

/**
 * Which start profile a contained session starts with: a signed-in start uses the protected-account profile once its
 * driver's account isolation is proven, or while the trial names that driver; every other start the standard one.
 */
final readonly class StartProfiles
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

    /**
     * Whether the installation runs this driver's protected-account profile on trial, before its evidence is recorded.
     */
    public function isOnTrial(string $driver): bool
    {
        return in_array($driver, $this->trialDrivers, true);
    }

    public function for(string $driver, SelectedAccount|null $account): StartProfileType
    {
        if ($account === null) {
            return StartProfileType::Standard;
        }

        return $this->forSignedIn($driver);
    }

    /**
     * The start profile a signed-in start of the driver uses, which is the one whose protection decides whether the
     * driver may start contained at all.
     */
    public function forSignedIn(string $driver): StartProfileType
    {
        if (! $this->arrangement->arrangement->isContained()) {
            return StartProfileType::Standard;
        }

        $isolation = $this->capabilities->capability(new HostCapabilityQuery(
            HostCapabilityType::AccountIsolation,
            $driver,
            AccountModeType::Subscription,
            ExecutionModeType::RequiredContainer,
        ));

        if ($isolation->isSupported() || $this->isOnTrial($driver)) {
            return StartProfileType::ProtectedAccount;
        }

        return StartProfileType::Standard;
    }
}
