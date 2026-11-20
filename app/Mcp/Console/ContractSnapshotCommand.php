<?php

declare(strict_types=1);

namespace App\Mcp\Console;

use App\Mcp\Support\ContractSnapshot;
use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;
use Symfony\Component\Console\Attribute\AsCommand;

#[AsCommand(name: 'mcp:contract', description: 'Write the published MCP contract snapshot')]
final class ContractSnapshotCommand extends Command
{
    public function handle(ContractSnapshot $snapshot, Filesystem $files): int
    {
        if ($files->put(base_path(ContractSnapshot::PATH), $snapshot->render()) === false) {
            $this->error('The MCP contract snapshot could not be written.');

            return self::FAILURE;
        }

        $this->line(ContractSnapshot::PATH);

        return self::SUCCESS;
    }
}
