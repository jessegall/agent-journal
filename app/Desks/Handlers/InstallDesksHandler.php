<?php

declare(strict_types=1);

namespace App\Desks\Handlers;

use App\Contracts\CommandHandler;
use App\Desks\Commands\InstallDesks;
use App\Desks\Support\BuiltInDesks;

final readonly class InstallDesksHandler implements CommandHandler
{
    public function __construct(private BuiltInDesks $desks) {}

    public function handle(InstallDesks $command): void
    {
        $this->desks->install();
    }
}
