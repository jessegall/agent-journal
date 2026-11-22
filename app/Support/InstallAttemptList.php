<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\CurrentActor;
use App\Exceptions\InstallAttemptRefused;
use App\Models\InstallAttempt;
use App\Values\InstallAttemptPage;
use App\Values\InstallAttemptRow;
use Carbon\CarbonImmutable;

/**
 * The acting owner's install attempts, page by page: every open one and the settled ones of the last thirty days.
 * Whether the actor may connect projects is checked again on every read.
 */
final readonly class InstallAttemptList
{
    public function __construct(private CurrentActor $current, private ConnectionsOwnerCheck $owners) {}

    /**
     * @throws InstallAttemptRefused
     */
    public function page(string|null $cursor): InstallAttemptPage
    {
        $actor = $this->current->actor();

        if (! $this->owners->allows($actor)) {
            throw InstallAttemptRefused::notAllowed();
        }

        $now = CarbonImmutable::now();
        $page = InstallAttempt::listedFor($actor->actorId(), $cursor);

        $rows = array_map(fn (InstallAttempt $attempt) => new InstallAttemptRow(
            $attempt->reference,
            $attempt->mode->value,
            $attempt->target_label,
            $attempt->stateAt($now)->value,
            $attempt->version,
            (string) $attempt->created_at?->toIso8601String(),
            $attempt->binding_id,
        ), array_values($page->items()));

        return new InstallAttemptPage($rows, $page->nextCursor()?->encode());
    }
}
