<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Console\Concerns\PrintsPublicationOutcomes;
use App\Support\SkillPublishingService;
use Illuminate\Console\Command;

/**
 * The scheduled supervisor step: publishes the committed publications that wait, including one a killed run left
 * behind once its lease ran out.
 */
final class SkillResumeCommand extends Command
{
    use PrintsPublicationOutcomes;

    protected $signature = 'skill:resume';

    protected $description = 'Publish the skill sets that wait for a worker';

    public function handle(SkillPublishingService $publishing): int
    {
        return $this->printOutcomes($publishing->publishOpen($this->holder()));
    }
}
