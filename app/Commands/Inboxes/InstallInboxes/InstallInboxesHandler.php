<?php

declare(strict_types=1);

namespace App\Commands\Inboxes\InstallInboxes;

use App\Contracts\Bus\CommandHandler;
use App\Support\BuiltInInboxes;

final readonly class InstallInboxesHandler implements CommandHandler
{
    public function __construct(private BuiltInInboxes $inboxes) {}

    public function handle(InstallInboxesCommand $command): void
    {
        $this->inboxes->install();
    }
}
