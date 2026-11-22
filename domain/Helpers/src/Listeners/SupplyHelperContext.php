<?php

declare(strict_types=1);

namespace Domain\Helpers\Listeners;

use App\Contracts\Listener;
use App\Events\ContextStarted;
use Domain\Helpers\Models\HelperNotice;
use Domain\Helpers\Support\JobContext;

/**
 * Whenever an agent's context starts again (a start, clear, resume or compaction): a helper with a live job is given
 * its whole job context, and a parent is given the notices about its helpers' jobs it has not had yet. Both are
 * required, so a budget never cuts them.
 */
final readonly class SupplyHelperContext implements Listener
{
    public function __construct(private JobContext $jobs) {}

    public function handle(ContextStarted $event): void
    {
        $actor = $event->target->actorIdentity();

        foreach ($this->jobs->remindersFor($actor) as $reminder) {
            $event->reminders->add($reminder, true);
        }

        foreach (HelperNotice::undeliveredFor($actor) as $notice) {
            $event->reminders->add($notice->text, true);
            $notice->markDelivered();
        }
    }
}
