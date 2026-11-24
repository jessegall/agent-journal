<?php

declare(strict_types=1);

namespace App\Commands\Runs\AssessPartOutput;

use App\Contracts\Bus\CommandHandler;
use App\Models\Runs\PartRun;
use App\Support\PartAssessments;

/**
 * Assesses an ended part with its operation's approved pair; a part with no approved proven reader awaits its reader.
 */
final readonly class AssessPartOutputHandler implements CommandHandler
{
    public function __construct(private PartAssessments $assessments) {}

    public function handle(AssessPartOutputCommand $command): string
    {
        $part = PartRun::query()->whereKey($command->partRunId)->lockForUpdate()->sole();
        $pairs = $this->assessments->pairOf($part);

        if ($pairs === []) {
            return '';
        }

        return $this->assessments->assess($part, $pairs[0]);
    }
}
