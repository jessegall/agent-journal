<?php

declare(strict_types=1);

namespace App\Skills\Commands\FailSkillPublication;

use App\Bus\Contracts\CommandHandler;
use App\Models\Skills\SkillPublication;

final readonly class FailSkillPublicationHandler implements CommandHandler
{
    public function handle(FailSkillPublicationCommand $command): void
    {
        SkillPublication::findLockedById($command->publicationId)->fail($command->reason);
    }
}
