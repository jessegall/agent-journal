<?php

declare(strict_types=1);

namespace App\Skills\Handlers;

use App\Contracts\CommandHandler;
use App\Skills\Commands\FailSkillPublication;
use App\Skills\Models\SkillPublication;

final readonly class FailSkillPublicationHandler implements CommandHandler
{
    public function handle(FailSkillPublication $command): void
    {
        SkillPublication::lockById($command->publicationId)->fail($command->reason);
    }
}
