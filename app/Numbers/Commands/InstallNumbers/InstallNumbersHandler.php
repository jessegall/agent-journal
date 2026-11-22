<?php

declare(strict_types=1);

namespace App\Numbers\Commands\InstallNumbers;

use App\Contracts\CommandHandler;
use App\Numbers\Models\GlobalGroup;

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
