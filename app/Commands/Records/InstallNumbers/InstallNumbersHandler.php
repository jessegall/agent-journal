<?php

declare(strict_types=1);

namespace App\Commands\Records\InstallNumbers;

use App\Contracts\Bus\CommandHandler;
use App\Models\Records\GlobalGroup;

/**
 * Creates the journal's global number group unless it exists.
 */
final readonly class InstallNumbersHandler implements CommandHandler
{
    public function handle(InstallNumbersCommand $command): void
    {
        GlobalGroup::installJournal();
    }
}
