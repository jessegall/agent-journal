<?php

declare(strict_types=1);

namespace App\Commands\FailSkillPublication;

use App\Contracts\Bus\CommandHandler;
use App\Models\SkillPublication;

final readonly class FailSkillPublicationHandler implements CommandHandler
{
    public function handle(FailSkillPublicationCommand $command): void
    {
        SkillPublication::lockById($command->publicationId)->fail($command->reason);
    }
}
