<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Console\Concerns\PrintsPublicationOutcomes;
use App\Skills\Exceptions\SkillPublicationFailed;
use App\Skills\Exceptions\SkillPublicationMissing;
use App\Skills\SkillPublishingService;
use Illuminate\Console\Command;

/**
 * The operator's retry of one failed publication, once its cause is fixed: same generation, published at once.
 */
final class SkillRetryCommand extends Command
{
    use PrintsPublicationOutcomes;

    protected $signature = 'skill:retry {publication : The id of the failed publication}';

    protected $description = 'Publish a failed skill set again';

    public function handle(SkillPublishingService $publishing): int
    {
        $publicationId = (string) $this->argument('publication');

        try {
            $state = $publishing->retry($publicationId, $this->holder());
        } catch (SkillPublicationMissing|SkillPublicationFailed $refusal) {
            $this->error($refusal->getMessage());

            return self::FAILURE;
        }

        return $this->printOutcomes([$publicationId => $state]);
    }
}
