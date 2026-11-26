<?php

declare(strict_types=1);

namespace App\Accounts\Commands\RecordAccountNotice;

use App\Accounts\AccountNotices;
use App\Bus\Contracts\CommandHandler;

final readonly class RecordAccountNoticeHandler implements CommandHandler
{
    public function __construct(private AccountNotices $notices) {}

    public function handle(RecordAccountNoticeCommand $command): void
    {
        $this->notices->record($command->driver, $command->reason);
    }
}
