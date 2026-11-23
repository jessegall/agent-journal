<?php

declare(strict_types=1);

namespace App\Commands\DismissAccountNotice;

use App\Contracts\Bus\CommandHandler;
use App\Models\AccountNotice;
use Carbon\CarbonImmutable;

final readonly class DismissAccountNoticeHandler implements CommandHandler
{
    public function handle(DismissAccountNoticeCommand $command): void
    {
        $notice = AccountNotice::lockedById($command->noticeId);

        if ($notice->resolved_at !== null) {
            return;
        }

        $notice->resolveAt(CarbonImmutable::now());
    }
}
