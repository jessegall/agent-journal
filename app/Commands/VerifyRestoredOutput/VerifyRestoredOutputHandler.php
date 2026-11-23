<?php

declare(strict_types=1);

namespace App\Commands\VerifyRestoredOutput;

use App\Contracts\Bus\CommandHandler;
use App\Models\Runs\ProcessRun;
use App\Support\ManifestCheck;
use App\Values\PartCapture;
use App\Values\RestoredCaptures;

/**
 * Sets each part's capture from its manifest as the disk holds it now: complete only when every chunk is there with
 * its original checksum, otherwise incomplete or corrupt; nothing is made up.
 */
final readonly class VerifyRestoredOutputHandler implements CommandHandler
{
    public function __construct(private ManifestCheck $manifests) {}

    public function handle(VerifyRestoredOutputCommand $command): RestoredCaptures
    {
        $run = ProcessRun::query()->acrossActors()->whereKey($command->runId)->sole();
        $captures = [];

        foreach ($run->parts()->readLimit(500)->get() as $part) {
            $part->markCapture($this->manifests->stateOf($part));
            $captures[] = new PartCapture($part->id, $part->capture_state);
        }

        return new RestoredCaptures($captures);
    }
}
