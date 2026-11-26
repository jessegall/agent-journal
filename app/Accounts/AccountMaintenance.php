<?php

declare(strict_types=1);

namespace App\Accounts;

use App\Accounts\Commands\CancelAccountUses\CancelAccountUsesCommand;
use App\Accounts\Commands\HoldAccountUses\HoldAccountUsesCommand;
use App\Accounts\Commands\MaintainAccount\MaintainAccountCommand;
use App\Accounts\Commands\SettleAccountUses\SettleAccountUsesCommand;
use App\Accounts\Exceptions\AccountInUse;
use App\Accounts\Values\MaintenanceProgress;
use App\Bus\Contracts\CommandBus;
use App\Models\Accounts\Account;

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
        $this->commands->run(new MaintainAccountCommand($accountId));
        $account = Account::query()->findOrFail($accountId);
        $identity = $account->recordIdentity;
        $held = $this->commands->run(new HoldAccountUsesCommand($identity));
        $cancelled = $this->commands->run(new CancelAccountUsesCommand($identity));

        if ($account->hasLiveWriter()) {
            return new MaintenanceProgress($held->sessionIds, $cancelled, true, false);
        }

        try {
            $this->commands->run(new SettleAccountUsesCommand($identity));
        } catch (AccountInUse) {
            return new MaintenanceProgress($held->sessionIds, $cancelled, false, false);
        }

        return new MaintenanceProgress($held->sessionIds, $cancelled, false, true);
    }
}
