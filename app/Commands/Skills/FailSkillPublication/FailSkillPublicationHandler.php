<?php

declare(strict_types=1);

namespace App\Commands\Skills\FailSkillPublication;

use App\Contracts\Bus\CommandHandler;
use App\Models\Skills\SkillPublication;

final readonly class FailSkillPublicationHandler implements CommandHandler
{
    public function handle(FailSkillPublicationCommand $command): void
    {
        SkillPublication::findLockedById($command->publicationId)->fail($command->reason);
    }
}
