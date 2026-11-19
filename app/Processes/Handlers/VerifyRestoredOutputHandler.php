<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Actors\Contracts\CurrentAuthorizer;
use App\Contracts\CommandHandler;
use App\Processes\Commands\VerifyRestoredOutput;
use App\Processes\Enums\ProcessAbility;
use App\Processes\Models\CommandRequest;
use App\Processes\Models\ProcessRun;
use App\Processes\Policies\ProcessAdministrationPolicy;
use App\Processes\Support\ManifestCheck;
use App\Processes\Values\PartCapture;
use App\Processes\Values\RestoredCaptures;

/**
 * Sets each part's capture from its manifest as the disk holds it now: complete only when every chunk is there with
 * its original checksum, otherwise incomplete or corrupt; nothing is made up.
 */
final readonly class VerifyRestoredOutputHandler implements CommandHandler
{
    public function __construct(private CurrentAuthorizer $administration, private ManifestCheck $manifests) {}

    public function handle(VerifyRestoredOutput $command): RestoredCaptures
    {
        $this->administration->authorize(ProcessAdministrationPolicy::class, CommandRequest::class, ProcessAbility::Administer);
        $run = ProcessRun::query()->withoutGlobalScopes()->whereKey($command->runId)->sole();
        $captures = [];
        foreach ($run->parts()->readLimit(500)->get() as $part) {
            $part->markCapture($this->manifests->stateOf($part));
            $captures[] = new PartCapture($part->id, $part->capture_state);
        }

        return new RestoredCaptures($captures);
    }
}
