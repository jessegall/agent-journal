<?php

declare(strict_types=1);

namespace App\Skills\Listeners;

use App\Contracts\Listener;
use App\Skills\Events\SessionSkillsIntended;
use App\Skills\Support\SkillPublishing;

/**
 * Publishes a session's skill set right after the transaction that asked for it committed, as the journal itself; a
 * launch grant then hands it to the host, or refuses while it is not delivered.
 */
final readonly class PublishSessionSkills implements Listener
{
    private const string HOLDER = 'launch';

    public function __construct(
        private SkillPublishing $publishing,
    ) {}

    public function handle(SessionSkillsIntended $event): void
    {
        $this->publishing->publish($event->publicationId, self::HOLDER);
    }
}
