<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Contracts\CommandHandler;
use App\Profiles\Commands\SwitchAccount;
use App\Profiles\Events\AccountsChanged;
use App\Profiles\Models\Account;
use App\Profiles\Models\AccountNotice;
use App\Profiles\Models\ActiveAccount;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Chooses the account under the program's selection lock and then the account's, the order every launch takes, and
 * tells the owner's pages once that has committed. Choosing the chosen account again changes nothing.
 */
final readonly class SwitchAccountHandler implements CommandHandler
{
    public function __construct(private Dispatcher $events) {}

    public function handle(SwitchAccount $command): void
    {
        $program = Account::programOf($command->accountId);
        $selection = ActiveAccount::lockedFor($program);
        $account = Account::lockedForChange($command->accountId);

        AccountNotice::resolveFor($program->value, CarbonImmutable::now());

        if ($selection->select($account)) {
            $this->events->dispatch(new AccountsChanged($program->value, $account->id));
        }
    }
}
