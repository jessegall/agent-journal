<?php

declare(strict_types=1);

namespace App\Commands\Projects\ClaimProjectReads;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Models\Projects\ProjectRead;
use App\Values\ProjectReadClaim;
use App\Values\ProjectReadClaims;

final readonly class ClaimProjectReadsHandler implements CommandHandler
{
    public function __construct(private ServerClock $clock) {}

    public function handle(ClaimProjectReadsCommand $command): ProjectReadClaims
    {
        $now = $this->clock->now();
        $reads = ProjectRead::findClaimableFor($command->hostId, ClaimProjectReadsCommand::CLAIM_LIMIT, $now);

        foreach ($reads as $read) {
            $read->markClaimed($now);
        }

        return new ProjectReadClaims(array_map(ProjectReadClaim::of(...), $reads));
    }
}
