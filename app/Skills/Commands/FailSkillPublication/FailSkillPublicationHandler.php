<?php

declare(strict_types=1);

namespace App\Skills\Commands\FailSkillPublication;

use App\Contracts\CommandHandler;
use App\Skills\Models\SkillPublication;

final readonly class FailSkillPublicationHandler implements CommandHandler
{
    public function handle(FailSkillPublicationCommand $command): void
    {
        SkillPublication::lockById($command->publicationId)->fail($command->reason);
    }
}
