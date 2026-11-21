<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Contracts\CommandHandler;
use App\Profiles\Commands\RecordAccountNotice;
use App\Profiles\Support\AccountNotices;

final readonly class RecordAccountNoticeHandler implements CommandHandler
{
    public function __construct(private AccountNotices $notices) {}

    public function handle(RecordAccountNotice $command): void
    {
        $this->notices->record($command->program, $command->reason);
    }
}
