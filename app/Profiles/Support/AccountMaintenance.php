<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Agents\Commands\CancelAccountUses;
use App\Agents\Commands\HoldAccountUses;
use App\Agents\Commands\SettleAccountUses;
use App\Agents\Exceptions\AccountInUse;
use App\Bus\Contracts\CommandBus;
use App\Profiles\Commands\MaintainAccount;
use App\Profiles\Models\Account;
use App\Profiles\Values\MaintenanceProgress;

/**
 * Takes an account through maintenance in separate commits, so no account lock is held while Core handles each
 * agent and start: hold the account, then list its running uses, cancel its unclaimed starts, and settle once every
 * use has ended and no sign-in writes its folder. Run again until it is settled; each step changes nothing twice.
 */
final readonly class AccountMaintenance
{
    public function __construct(private CommandBus $commands) {}

    public function advance(string $accountId): MaintenanceProgress
    {
        $this->commands->run(new MaintainAccount($accountId));
        $account = Account::query()->findOrFail($accountId);
        $identity = $account->recordIdentity();
        $held = $this->commands->run(new HoldAccountUses($identity));
        $cancelled = $this->commands->run(new CancelAccountUses($identity));

        if ($account->hasLiveWriter()) {
            return new MaintenanceProgress($held->sessionIds, $cancelled, true, false);
        }

        try {
            $this->commands->run(new SettleAccountUses($identity));
        } catch (AccountInUse) {
            return new MaintenanceProgress($held->sessionIds, $cancelled, false, false);
        }

        return new MaintenanceProgress($held->sessionIds, $cancelled, false, true);
    }
}
