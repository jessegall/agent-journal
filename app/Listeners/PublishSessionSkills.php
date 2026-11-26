<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Events\Listener;
use App\Events\Skills\SessionSkillsIntended;
use App\Skills\SkillPublishingService;

/**
 * Publishes a session's skill set right after the transaction that asked for it committed, as the journal itself; a
 * start grant then hands it to the host, or refuses while it is not delivered.
 */
final readonly class PublishSessionSkills implements Listener
{
    private const string HOLDER = 'start';

    public function __construct(
        private SkillPublishingService $publishing,
    ) {}

    public function handle(SessionSkillsIntended $event): void
    {
        $this->publishing->publish($event->publicationId, self::HOLDER);
    }
}
