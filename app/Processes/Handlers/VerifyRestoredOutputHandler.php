<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Contracts\CommandHandler;
use App\Processes\Commands\VerifyRestoredOutput;
use App\Processes\Models\ProcessRun;
use App\Processes\Support\ManifestCheck;

/**
 * Sets each part's capture from its manifest as the disk holds it now: complete only when every chunk is there with
 * its original checksum, otherwise incomplete or corrupt; nothing is made up.
 */
final readonly class VerifyRestoredOutputHandler implements CommandHandler
{
    public function __construct(private ManifestCheck $manifests) {}

    /**
     * @return array<string, string> part id => capture state
     */
    public function handle(VerifyRestoredOutput $command): array
    {
        $run = ProcessRun::query()->withoutGlobalScopes()->whereKey($command->runId)->sole();
        $states = [];
        foreach ($run->parts()->readLimit(500)->get() as $part) {
            $part->markCapture($this->manifests->stateOf($part));
            $states[$part->id] = $part->capture_state->value;
        }

        return $states;
    }
}
