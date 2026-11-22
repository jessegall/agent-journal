<?php

declare(strict_types=1);

namespace App\Mcp\Console;

use App\Contracts\Files\Files;
use App\Enums\Place;
use App\Exceptions\FileUnwritable;
use App\Mcp\Support\ContractSnapshot;
use App\Values\FilePath;
use Illuminate\Console\Command;
use Symfony\Component\Console\Attribute\AsCommand;

#[AsCommand(name: 'mcp:contract', description: 'Write the published MCP contract snapshot')]
final class ContractSnapshotCommand extends Command
{
    public function handle(ContractSnapshot $snapshot, Files $files): int
    {
        try {
            $files->write(FilePath::in(Place::Project, ContractSnapshot::PATH), $snapshot->render());
        } catch (FileUnwritable) {
            $this->error('The MCP contract snapshot could not be written.');

            return self::FAILURE;
        }

        $this->line(ContractSnapshot::PATH);

        return self::SUCCESS;
    }
}
