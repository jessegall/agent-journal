<?php

declare(strict_types=1);

namespace App\Commands\DismissAccountNotice;

use App\Contracts\CommandHandler;
use App\Models\AccountNotice;
use Carbon\CarbonImmutable;

final readonly class DismissAccountNoticeHandler implements CommandHandler
{
    public function handle(DismissAccountNoticeCommand $command): void
    {
        $notice = AccountNotice::query()->whereKey($command->noticeId)->lockForUpdate()->firstOrFail();

        if ($notice->resolved_at !== null) {
            return;
        }

        $notice->resolveAt(CarbonImmutable::now());
    }
}
