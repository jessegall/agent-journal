<?php

declare(strict_types=1);

namespace App\Numbers\Handlers;

use App\Numbers\Commands\InstallNumbers;
use App\Numbers\Models\GlobalGroup;

/**
 * Creates the journal's global number group unless it exists.
 */
final readonly class InstallNumbersHandler
{
    public function handle(InstallNumbers $command): void
    {
        GlobalGroup::installJournal();
    }
}
