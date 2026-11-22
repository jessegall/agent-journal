<?php

declare(strict_types=1);

namespace App\Commands\InstallDesks;

use App\Contracts\Bus\CommandHandler;
use App\Support\BuiltInDesks;

final readonly class InstallDesksHandler implements CommandHandler
{
    public function __construct(private BuiltInDesks $desks) {}

    public function handle(InstallDesksCommand $command): void
    {
        $this->desks->install();
    }
}
