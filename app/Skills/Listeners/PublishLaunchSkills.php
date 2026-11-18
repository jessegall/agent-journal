<?php

declare(strict_types=1);

namespace App\Skills\Listeners;

use App\Contracts\Listener;
use App\Skills\Events\LaunchSkillsIntended;
use App\Skills\Support\SkillPublishing;

/**
 * Publishes a launch's skill set right after the launch committed, as the journal itself; the grant then hands it to
 * the host, or refuses while it is not delivered.
 */
final readonly class PublishLaunchSkills implements Listener
{
    private const string HOLDER = 'launch';

    public function __construct(
        private SkillPublishing $publishing,
    ) {}

    public function handle(LaunchSkillsIntended $event): void
    {
        $this->publishing->publish($event->publicationId, self::HOLDER);
    }
}
