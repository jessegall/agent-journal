<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Drivers\DriverCatalogue;
use App\Enums\Drivers\DriverCapability;
use App\Exceptions\AccountWriterTaken;
use App\Models\Agents\AgentRuntime;
use App\Models\Sessions\SessionProcess;
use App\Values\BoundTarget;
use App\Values\DriverKey;
use App\Values\PinnedDriver;
use App\Values\SelectedAccount;

/**
 * Keeps a driver that refreshes its own sign-in alone on its account: it starts only on an account nothing else uses,
 * and nothing else starts on an account it uses, so one sign-in never has two writers.
 */
final readonly class AccountSharingService
{
    public function __construct(private DriverCatalogue $drivers) {}

    /**
     * @throws AccountWriterTaken
     */
    public function assertMayStart(PinnedDriver $driver, SelectedAccount $account): void
    {
        $sessionIds = SessionProcess::resolveUnresolvedSessionIdsOf($account->record);

        if ($sessionIds === []) {
            return;
        }

        if (! $driver->support->allows(DriverCapability::SharedAccount)) {
            throw AccountWriterTaken::inUseBy($sessionIds[0]);
        }

        foreach (AgentRuntime::resolveDriverKeysOfSessions($sessionIds) as $sessionId => $driverKey) {
            $support = $this->drivers->forKey(DriverKey::from($driverKey))
                ->capabilities(BoundTarget::beforePlacement());

            if (! $support->allows(DriverCapability::SharedAccount)) {
                throw AccountWriterTaken::heldBy($sessionId);
            }
        }
    }
}
