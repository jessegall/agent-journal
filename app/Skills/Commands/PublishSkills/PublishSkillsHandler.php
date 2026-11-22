<?php

declare(strict_types=1);

namespace App\Skills\Commands\PublishSkills;

use App\Contracts\CommandHandler;
use App\Skills\Drivers\DriverSkillAdapters;
use App\Skills\Exceptions\SkillPublicationFailed;
use App\Skills\Models\SkillPublication;
use App\Skills\Support\PublicationFiles;
use App\Skills\Support\SkillTargets;
use App\Skills\Values\PublicationClaim;
use Carbon\CarbonImmutable;

final readonly class PublishSkillsHandler implements CommandHandler
{
    private const int LEASE_SECONDS = 120;

    public function __construct(
        private SkillTargets $targets,
        private DriverSkillAdapters $adapters,
    ) {}

    public function handle(PublishSkillsCommand $command): PublicationClaim
    {
        $publication = SkillPublication::lockById($command->publicationId);

        if (! $publication->isClaimable(CarbonImmutable::now())) {
            throw SkillPublicationFailed::notClaimable($publication->state);
        }

        $fence = $publication->claim($command->holder, CarbonImmutable::now()->addSeconds(self::LEASE_SECONDS));
        $files = PublicationFiles::of($publication, $this->targets, $this->adapters);

        return new PublicationClaim($publication->id, $fence, $files->count());
    }
}
