<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Access\Contracts\AuthoritySource;
use App\Access\Values\OwnerAuthority;
use App\Actors\Contracts\AgentTexts;
use App\Actors\Contracts\CurrentActorSetter;
use App\Agents\Drivers\Capabilities\DriverCapabilities;
use App\Agents\Drivers\Enums\ToolAllowance;
use App\Agents\Drivers\Hooks\DriverReplies;
use App\Api\Hooks\AgentStateMachine;
use App\Api\SignedCall;
use App\Bus\OutsideCommandAllowance;
use App\Models\Access\User;
use App\Stacks\HookAnswer;
use App\Support\ActorReference;
use App\Support\AgentContext;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\Inputs\StopRequested;
use App\Support\OperationDeadline;
use App\Values\InboxMemberAuthority;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Contracts\Auth\Factory as AuthFactory;
use Illuminate\Contracts\Foundation\Application;
use Tests\Support\Seeding\Exceptions\FixtureRefused;
use Tests\Support\TestStartAuthority;
use Throwable;

/**
 * Who the request a test's journal acts in acts as: one agent, user or chat member, bound the way the authenticating
 * middleware binds them, and a selection that fails puts the one before it back.
 */
final class FixtureRequests
{
    private const int HOOK_DEADLINE_MILLISECONDS = 3000;

    private Closure|null $selected = null;

    private int $hookCallCount = 0;

    public function __construct(private readonly Application $app) {}

    public function asAgent(string $agentId, string $sessionId): void
    {
        $this->select(fn () => $this->bindAgent(new StackTarget($agentId, $sessionId), 'call-1'));
    }

    /**
     * Sends the hook through the target agent's state machine under a signed call id of its own, refusing writes
     * outside a command as the hook route does, and returns the stack's answer; the test driver replies to a stop
     * with its stop reply and to every other hook with an allow, and the selection in place comes back on every exit.
     */
    public function answerHook(StackTarget $target, HookInput $input, DriverCapabilities $capabilities): HookAnswer
    {
        $answered = null;
        $callId = 'hook-call-'.++$this->hookCallCount;
        $render = function (HookAnswer $answer, AgentTexts $texts) use (&$answered, $input) {
            $answered = $answer;

            return $input instanceof StopRequested
                ? DriverReplies::stop($answer, $texts)
                : DriverReplies::allowTool($answer->shownContext($texts), ToolAllowance::AllowDecision);
        };

        $this->during(
            fn () => $this->bindAgent($target, $callId),
            fn () => $this->app->make(OutsideCommandAllowance::class)->forbidDuring(
                fn () => $this->app->make(AgentStateMachine::class)->answer(
                    $input,
                    $capabilities,
                    new OperationDeadline(self::HOOK_DEADLINE_MILLISECONDS),
                    $render,
                ),
            ),
        );

        return $answered ?? throw FixtureRefused::hookReplayed($callId);
    }

    /**
     * An agent known only by its id, acting under the authority its start gives it, with no session bound.
     */
    public function asAgentId(string $agentId): void
    {
        $this->select(fn () => $this->app->make(CurrentActorSetter::class)->set(
            ActorReference::forAgent($agentId),
            TestStartAuthority::forAgent($agentId),
        ));
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
     * Binds the selection in place again, after something the test ran set an actor of its own.
     */
    public function reselect(): void
    {
        $this->restore($this->selected);
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

    /**
     * Runs the work and keeps the selection it left; work that fails puts the selection before it back.
     *
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function keepingOnSuccess(Closure $work): mixed
    {
        $prior = $this->selected;

        try {
            return $work();
        } catch (Throwable $failure) {
            $this->restore($prior);

            throw $failure;
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

    private function bindAgent(StackTarget $target, string $callId): void
    {
        $this->app->instance(AgentContext::class, new AgentContext(
            $target->agentId,
            $target->sessionId,
            new SignedCall($callId, CarbonImmutable::now(), str_repeat('a', 64)),
            null,
        ));
        $this->app->make(CurrentActorSetter::class)->set(
            ActorReference::forAgent($target->agentId),
            TestStartAuthority::forAgent($target->agentId),
        );
    }

    private function actAsUser(string $userId, AuthoritySource $authority): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorReference::forUser($userId), $authority);
    }

    /**
     * Forgets who the request in place acts as: its agent, its signed-in user and its actor; what the request bound in
     * its scope stays, as a switch of actor inside one request keeps it.
     */
    private function clear(): void
    {
        $this->app->forgetInstance(AgentContext::class);
        $this->app->make(AuthFactory::class)->guard()->forgetUser();
        $this->app->make(CurrentActorSetter::class)->clear();
    }
}
