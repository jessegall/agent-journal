<?php

declare(strict_types=1);

namespace App\Inboxes\Commands\InstallInboxes;

use App\Bus\Contracts\CommandHandler;
use App\Inboxes\BuiltInInboxes;

final readonly class InstallInboxesHandler implements CommandHandler
{
    public function __construct(private BuiltInInboxes $inboxes) {}

    public function handle(InstallInboxesCommand $command): void
    {
        $this->inboxes->install();
    }
}
