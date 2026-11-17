<?php

declare(strict_types=1);

namespace App\Core\Web\Console;

use App\Core\Web\Support\UiManifest;
use Illuminate\Console\Command;

/**
 * Writes the browser build's view of the installed domains; the build runs it before Wayfinder, the types and Vite.
 */
final class GenerateUiManifest extends Command
{
    protected $signature = 'journal:ui-manifest';

    protected $description = 'Write the UI manifest, TypeScript and Vite configuration and Tailwind sources of the installed domains';

    public function handle(UiManifest $manifest): int
    {
        $this->info('UI manifest written: '.$manifest->write($this->laravel->basePath()));

        return self::SUCCESS;
    }
}
