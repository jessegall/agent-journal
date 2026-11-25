<?php

declare(strict_types=1);

namespace Domain\Helpers\Listeners;

use App\Contracts\Events\Listener;
use App\Events\Hooks\ContextStarted;
use App\Values\AgentText;
use Domain\Helpers\Models\HelperNotice;

/**
 * Tells a parent, when its context starts, each notice about its helpers' jobs it has not read, once each. A helper's
 * own job reaches it through the job's state on its stack.
 */
final readonly class SupplyHelperNotices implements Listener
{
    public function handle(ContextStarted $event): void
    {
        $actor = $event->target->actorReference();

        foreach (HelperNotice::findUndeliveredFor($actor) as $notice) {
            $event->reminders->add(AgentText::of('helpers.notice', ['notice' => $notice->text]), true);
            $notice->markDelivered();
        }
    }
}
