<?php

declare(strict_types=1);

namespace App\Commands\Accounts\RecordAccountNotice;

use App\Contracts\Bus\CommandHandler;
use App\Support\AccountNotices;

final readonly class RecordAccountNoticeHandler implements CommandHandler
{
    public function __construct(private AccountNotices $notices) {}

    public function handle(RecordAccountNoticeCommand $command): void
    {
        $this->notices->record($command->driver, $command->reason);
    }
}
