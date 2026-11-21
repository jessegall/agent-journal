<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Contracts\CommandHandler;
use App\Profiles\Commands\DismissAccountNotice;
use App\Profiles\Events\AccountsChanged;
use App\Profiles\Models\AccountNotice;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class DismissAccountNoticeHandler implements CommandHandler
{
    public function __construct(private Dispatcher $events) {}

    public function handle(DismissAccountNotice $command): void
    {
        $notice = AccountNotice::query()->whereKey($command->noticeId)->lockForUpdate()->firstOrFail();

        if ($notice->resolved_at !== null) {
            return;
        }

        $notice->resolveAt(CarbonImmutable::now());
        $this->events->dispatch(new AccountsChanged($notice->program, $notice->id));
    }
}
