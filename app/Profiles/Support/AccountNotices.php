<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Profiles\Enums\AccountNoticeReason;
use App\Profiles\Models\AccountNotice;
use App\Profiles\Models\ActiveAccount;
use App\Programs\Enums\HookProgram;
use Carbon\CarbonImmutable;

/**
 * Records and resolves a program's account notices under the program's selection lock, so two records of the same
 * notice count one row twice and a resolve never races a record; each notice changes only its own row.
 */
final readonly class AccountNotices
{
    /**
     * Records that it happened: an open notice of the same program and reason counts once more instead of repeating.
     */
    public function record(string $program, AccountNoticeReason $reason): AccountNotice
    {
        ActiveAccount::lockedForJournal(HookProgram::from($program));
        $open = AccountNotice::lockedOpenFor($program, $reason);

        if ($open === null) {
            return AccountNotice::create($program, $reason);
        }

        $open->countAgain();

        return $open;
    }

    /**
     * Resolves the program's open notices once its accounts work again, in the order of their ids.
     */
    public function resolveOpen(string $program, CarbonImmutable $now): void
    {
        ActiveAccount::lockedForJournal(HookProgram::from($program));

        foreach (AccountNotice::lockedOpenOf($program) as $notice) {
            $notice->resolveAt($now);
        }
    }
}
