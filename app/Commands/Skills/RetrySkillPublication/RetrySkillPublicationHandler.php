<?php

declare(strict_types=1);

namespace App\Commands\Skills\RetrySkillPublication;

use App\Contracts\Bus\CommandHandler;
use App\Models\Skills\SkillPublication;

final readonly class RetrySkillPublicationHandler implements CommandHandler
{
    public function handle(RetrySkillPublicationCommand $command): void
    {
        SkillPublication::findLockedById($command->publicationId)->retry();
    }
}
