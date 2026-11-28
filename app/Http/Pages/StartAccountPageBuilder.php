<?php

declare(strict_types=1);

namespace App\Http\Pages;

use App\Accounts\Contracts\AccountUses;
use App\Accounts\Data\StartAccountData;
use App\Accounts\Exceptions\AccountUseMissing;
use App\Http\Requests\Profiles\StartAccountPageRequest;
use App\Models\Accounts\Account;
use App\Reads\PageFormRequests;
use App\Web\Creation\Contracts\PageBuilder;
use Illuminate\Http\Request;

/**
 * Reads the account a start ran with through the owner-only account uses, and its label from the saved accounts; a
 * removed account is still found, under the label it had when it was removed.
 */
final readonly class StartAccountPageBuilder implements PageBuilder
{
    private const int MOST_USES = 200;

    public function __construct(
        private PageFormRequests $requests,
        private AccountUses $uses,
    ) {}

    /**
     * @throws AccountUseMissing
     */
    public function build(Request $visit): StartAccountData
    {
        $input = $this->requests->forVisit(StartAccountPageRequest::class, $visit);

        $sessionId = $input->sessionId();
        $identity = $this->uses->accountOf($sessionId, Account::linkType());
        $account = Account::query()->whereKey($identity->id)->firstOrFail();

        foreach ($this->uses->history($identity, self::MOST_USES) as $use) {
            if ($use->sessionId === $sessionId) {
                return StartAccountData::build()->useOf($use, $account)->finish();
            }
        }

        throw AccountUseMissing::forSession($sessionId, Account::linkType(), 0);
    }
}
