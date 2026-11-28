<?php

declare(strict_types=1);

namespace App\Web;

use App\Actors\Contracts\CurrentUserResolver;
use App\Actors\CurrentUser;
use App\Web\Attributes\Live;
use App\Web\Values\LiveListeners;
use Closure;
use Inertia\DeferProp;
use Inertia\LiveProp;
use Inertia\OptionalProp;
use Inertia\ResponseFactory;
use Inertia\SupportsLiveUpdates;
use PhpOption\Option;

/**
 * Inertia props that refresh when the viewer's page changes: each is marked live on the viewer's own channel, and a
 * guest, who has no channel, gets the same prop unmarked.
 */
final readonly class LiveProps
{
    public function __construct(private CurrentUserResolver $users, private ResponseFactory $inertia) {}

    /**
     * A prop read only when a partial reload names it.
     */
    public function optional(callable $read): OptionalProp
    {
        return $this->mark($this->inertia->optional($read));
    }

    /**
     * A prop read after the first paint, together with the other props of its group.
     */
    public function deferred(callable $read, string $group): DeferProp
    {
        return $this->mark($this->inertia->defer($read, $group));
    }

    /**
     * A prop read on every visit that does not leave it out.
     */
    public function value(Closure $read, Live|null $live = null): LiveProp|Closure
    {
        return $this->listeners($live)
            ->map(fn (LiveListeners $listeners) => $this->inertia->live($read, $listeners->events, $listeners->channel))
            ->getOrElse($read);
    }

    /**
     * @template T of SupportsLiveUpdates
     *
     * @param  T  $prop
     * @return T
     */
    public function mark(SupportsLiveUpdates $prop, Live|null $live = null): SupportsLiveUpdates
    {
        return $this->listeners($live)->map(fn (LiveListeners $listeners) => $listeners->mark($prop))->getOrElse($prop);
    }

    /**
     * @return Option<LiveListeners>
     */
    private function listeners(Live|null $live): Option
    {
        return $this->users->currentUser()->map(
            fn (CurrentUser $user) => LiveListeners::pageChanges($user->id, $live?->events ?? []),
        );
    }
}
