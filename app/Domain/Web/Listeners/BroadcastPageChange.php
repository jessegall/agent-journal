<?php

declare(strict_types=1);

namespace App\Domain\Web\Listeners;

use App\Domain\Access\Contracts\JournalAccessPolicy;
use App\Domain\Chat\Events\MessageAnswered;
use App\Domain\Chat\Events\MessageDismissed;
use App\Domain\Chat\Events\MessageSent;
use App\Domain\Plans\Events\PlanProgressChanged;
use App\Domain\Plans\Events\PlanStarted;
use App\Domain\Rules\Events\RuleApproved;
use App\Domain\Rules\Events\RuleDenied;
use App\Domain\Rules\Events\RuleRemoved;
use App\Domain\Web\Events\PageChanged;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Turns each committed fact that changes what a page shows into one page change for the users Access allows. The
 * producers raise their facts after commit and know nothing of the browser.
 */
final readonly class BroadcastPageChange
{
    public function __construct(
        private JournalAccessPolicy $access,
        private Dispatcher $events,
    ) {}

    public function handle(PlanStarted|PlanProgressChanged|MessageSent|MessageAnswered|MessageDismissed|RuleApproved|RuleDenied|RuleRemoved $event): void
    {
        $userIds = $this->access->allowedUserIds();

        if ($userIds === []) {
            return;
        }

        $this->events->dispatch(new PageChanged($userIds));
    }
}
