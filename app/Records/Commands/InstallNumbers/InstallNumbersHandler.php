<?php

declare(strict_types=1);

namespace App\Records\Commands\InstallNumbers;

use App\Bus\Contracts\CommandHandler;
use App\Models\Records\GlobalGroup;

/**
 * Creates the journal's global number group unless it exists.
 */
final readonly class InstallNumbersHandler implements CommandHandler
{
    public function handle(InstallNumbersCommand $command): void
    {
        GlobalGroup::create();
    }
}
