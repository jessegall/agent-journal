<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Contracts\CommandHandler;
use App\Profiles\Commands\DismissAccountNotice;
use App\Profiles\Models\AccountNotice;
use Carbon\CarbonImmutable;

final readonly class DismissAccountNoticeHandler implements CommandHandler
{
    public function handle(DismissAccountNotice $command): void
    {
        $notice = AccountNotice::query()->whereKey($command->noticeId)->lockForUpdate()->firstOrFail();

        if ($notice->resolved_at !== null) {
            return;
        }

        $notice->resolveAt(CarbonImmutable::now());
    }
}
