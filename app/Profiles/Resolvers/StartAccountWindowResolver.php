<?php

declare(strict_types=1);

namespace App\Profiles\Resolvers;

use App\Agents\Contracts\AccountUses;
use App\Agents\Exceptions\AccountUseMissing;
use App\Http\Data\Profiles\StartAccountData;
use App\Http\Requests\Profiles\StartAccountPageRequest;
use App\Profiles\Models\Account;
use App\Ui\Contracts\PageResolver;

/**
 * Reads the account a start ran with through the owner-only account uses, and its label from the saved accounts; a
 * removed account is still found, under the label it had when it was removed.
 */
final readonly class StartAccountWindowResolver implements PageResolver
{
    private const int MOST_USES = 200;

    public function __construct(
        private StartAccountPageRequest $page,
        private AccountUses $uses,
    ) {}

    /**
     * @throws AccountUseMissing
     */
    public function read(): StartAccountData
    {
        $sessionId = $this->page->sessionId();
        $identity = $this->uses->accountOf($sessionId, Account::LINK_TYPE);
        $account = Account::query()->whereKey($identity->id)->firstOrFail();

        foreach ($this->uses->history($identity, self::MOST_USES) as $use) {
            if ($use->sessionId === $sessionId) {
                return StartAccountData::fromUse($use, $account);
            }
        }

        throw AccountUseMissing::forSession($sessionId, Account::LINK_TYPE, 0);
    }
}
