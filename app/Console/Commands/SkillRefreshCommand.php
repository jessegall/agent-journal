<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Console\Concerns\PrintsPublicationOutcomes;
use App\Support\SkillPublishingService;
use App\Support\SkillTables;
use Illuminate\Console\Command;

/**
 * The host's start-up and update step, as the journal itself: checks and renders the catalogue as one generation, then
 * publishes every publication that waits.
 */
final class SkillRefreshCommand extends Command
{
    use PrintsPublicationOutcomes;

    protected $signature = 'skill:refresh';

    protected $description = 'Check and render every skill, then publish the waiting skill sets';

    public function handle(SkillTables $tables, SkillPublishingService $publishing): int
    {
        if (! $tables->exist()) {
            $this->error('The skills tables do not exist yet: run php artisan migrate first. Nothing was changed.');

            return self::FAILURE;
        }

        $refresh = $publishing->refresh();

        if ($refresh->hasFailed) {
            $this->error("The skills could not be generated, the previous generation stays in use: {$refresh->reason}");
            $this->printOutcomes($publishing->publishOpen($this->holder()));

            return self::FAILURE;
        }

        $this->line($refresh->isReused
            ? "Generation {$refresh->generationId} is unchanged."
            : "Generation {$refresh->generationId} is ready.");

        return $this->printOutcomes($publishing->publishOpen($this->holder()));
    }
}
