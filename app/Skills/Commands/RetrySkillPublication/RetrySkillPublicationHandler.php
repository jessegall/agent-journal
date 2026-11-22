<?php

declare(strict_types=1);

namespace App\Skills\Commands\RetrySkillPublication;

use App\Contracts\CommandHandler;
use App\Skills\Models\SkillPublication;

final readonly class RetrySkillPublicationHandler implements CommandHandler
{
    public function handle(RetrySkillPublicationCommand $command): void
    {
        SkillPublication::lockById($command->publicationId)->retry();
    }
}
