<?php

declare(strict_types=1);

namespace App\Support;

use App\Commands\Accounts\CancelAccountUses\CancelAccountUsesCommand;
use App\Commands\Accounts\HoldAccountUses\HoldAccountUsesCommand;
use App\Commands\Accounts\MaintainAccount\MaintainAccountCommand;
use App\Commands\Accounts\SettleAccountUses\SettleAccountUsesCommand;
use App\Contracts\Bus\CommandBus;
use App\Exceptions\AccountInUse;
use App\Models\Accounts\Account;
use App\Values\MaintenanceProgress;

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
        $identity = $account->recordIdentity();
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
