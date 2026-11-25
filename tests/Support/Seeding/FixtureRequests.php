<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Authorization\AuthoritySource;
use App\Models\Access\User;
use App\Support\ActorContext;
use App\Support\AgentContext;
use App\Support\SignedCall;
use App\Values\InboxMemberAuthority;
use App\Values\OwnerAuthority;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Contracts\Auth\Factory as AuthFactory;
use Illuminate\Contracts\Foundation\Application;
use Tests\Support\TestStartAuthority;
use Throwable;

/**
 * The request a test's journal acts in: each selection starts a clean request as one agent, user or chat member, the
 * way the authenticating middleware binds them, and a selection that fails puts the one before it back.
 */
final class FixtureRequests
{
    private Closure|null $selected = null;

    public function __construct(private readonly Application $app) {}

    public function asAgent(string $agentId, string $sessionId): void
    {
        $this->select(function () use ($agentId, $sessionId): void {
            $this->app->instance(AgentContext::class, new AgentContext(
                $agentId,
                $sessionId,
                new SignedCall('call-1', CarbonImmutable::now(), str_repeat('a', 64)),
                null,
            ));
            $this->app->make(CurrentActorSetter::class)->set(
                ActorContext::forAgent($agentId),
                TestStartAuthority::forAgent($agentId),
            );
        });
    }

    /**
     * The user signed in, under the owner's authority the tests act with; the journal's owner stays whoever it was.
     */
    public function asUser(User $user): void
    {
        $this->select(function () use ($user): void {
            $this->app->make(AuthFactory::class)->guard()->setUser($user);
            $this->actAsUser($user->id, new OwnerAuthority('test'));
        });
    }

    /**
     * A user known only by its id, with no one signed in: a user the journal may not hold at all.
     */
    public function asUserId(string $userId): void
    {
        $this->select(fn () => $this->actAsUser($userId, new OwnerAuthority('test')));
    }

    /**
     * An admitted user who is not the owner, signed in under the chat-only authority its sign-in gives it.
     */
    public function asInboxMember(User $user): void
    {
        $this->select(function () use ($user): void {
            $this->app->make(AuthFactory::class)->guard()->setUser($user);
            $this->actAsUser($user->id, new InboxMemberAuthority('test'));
        });
    }

    public function asInboxMemberId(string $userId): void
    {
        $this->select(fn () => $this->actAsUser($userId, new InboxMemberAuthority('test')));
    }

    /**
     * No one: no signed-in user, no actor and no request authority.
     */
    public function asGuest(): void
    {
        $this->select(function (): void {});
    }

    /**
     * Runs the work under another selection and puts the one in place back afterwards, whatever the work did.
     *
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function during(Closure $selection, Closure $work): mixed
    {
        $prior = $this->selected;

        try {
            $this->select($selection);

            return $work();
        } finally {
            $this->restore($prior);
        }
    }

    private function select(Closure $selection): void
    {
        $prior = $this->selected;

        try {
            $this->clear();
            $selection();
            $this->selected = $selection;
        } catch (Throwable $failure) {
            $this->restore($prior);

            throw $failure;
        }
    }

    private function restore(Closure|null $prior): void
    {
        $this->clear();
        $this->selected = $prior;

        if ($prior !== null) {
            $prior();
        }
    }

    private function actAsUser(string $userId, AuthoritySource $authority): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser($userId), $authority);
    }

    /**
     * Forgets everything the request in place bound: its scoped bindings, its agent, its signed-in user and its actor.
     */
    private function clear(): void
    {
        $this->app->forgetScopedInstances();
        $this->app->forgetInstance(AgentContext::class);
        $this->app->make(AuthFactory::class)->guard()->forgetUser();
        $this->app->make(CurrentActorSetter::class)->clear();
    }
}
