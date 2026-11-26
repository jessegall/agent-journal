<?php

declare(strict_types=1);

namespace App\Skills\Commands\RetrySkillPublication;

use App\Bus\Contracts\CommandHandler;
use App\Models\Skills\SkillPublication;

final readonly class RetrySkillPublicationHandler implements CommandHandler
{
    public function handle(RetrySkillPublicationCommand $command): void
    {
        SkillPublication::findLockedById($command->publicationId)->retry();
    }
}
