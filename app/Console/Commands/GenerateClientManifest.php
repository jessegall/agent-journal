<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Support\ClientManifest;
use Illuminate\Console\Command;

/**
 * Writes the browser build's view of the installed domains; the build runs it before Wayfinder, the types and Vite.
 */
final class GenerateClientManifest extends Command
{
    protected $signature = 'journal:client-manifest';

    protected $description = 'Write the client manifest, TypeScript and Vite configuration and Tailwind sources of the installed domains';

    public function handle(ClientManifest $manifest): int
    {
        $this->info('Client manifest written: '.$manifest->write($this->laravel->basePath()));

        return self::SUCCESS;
    }
}
