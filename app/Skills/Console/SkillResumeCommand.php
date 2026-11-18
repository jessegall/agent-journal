<?php

declare(strict_types=1);

namespace App\Skills\Console;

use App\Skills\Console\Concerns\PrintsPublicationOutcomes;
use App\Skills\Support\SkillPublishing;
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

    public function handle(SkillPublishing $publishing): int
    {
        return $this->printOutcomes($publishing->publishOpen($this->holder()));
    }
}
