<?php

declare(strict_types=1);

namespace App\Commands\RetrySkillPublication;

use App\Contracts\Bus\CommandHandler;
use App\Models\SkillPublication;

final readonly class RetrySkillPublicationHandler implements CommandHandler
{
    public function handle(RetrySkillPublicationCommand $command): void
    {
        SkillPublication::lockById($command->publicationId)->retry();
    }
}
