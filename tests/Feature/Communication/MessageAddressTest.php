<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Actors\Exceptions\ActorUnavailable;
use App\Actors\Support\ActorIdentity;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Communication\Contracts\MessageAddressReader;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Illuminate\Support\Facades\DB;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * A message is addressed to an actor that can receive it and, for an agent, to one of its own sessions that still
 * accepts messages; the sender is always the request's own actor and session.
 */
final class MessageAddressTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;

    private const array TABLES = ['users', 'agents', 'agent_sessions'];

    private Agent $first;

    private Agent $second;

    private AgentSession $secondSession;

    protected function setUp(): void
    {
        parent::setUp();

        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->first = Agent::query()->create(['name' => 'First', 'role' => 'hooks.main_ready']);
        $this->second = Agent::query()->create(['name' => 'Second', 'role' => 'hooks.main_ready']);
        $this->secondSession = new AgentSession;
        $this->secondSession->startFor($this->second, null);
        $this->startUserRequestAs($owner->id);
    }

    public function test_an_agent_is_reached_in_its_own_session_that_accepts_messages(): void
    {
        $address = DB::transaction(fn () => $this->addresses()->recipient(ActorIdentity::of($this->second), $this->secondSession->id));

        $this->assertSame($this->secondSession->id, $address->sessionId);
    }

    public function test_another_agents_session_or_an_ended_one_is_refused(): void
    {
        $this->assertThrows(fn () => DB::transaction(fn () => $this->addresses()->recipient(ActorIdentity::of($this->first), $this->secondSession->id)), ActorUnavailable::class);

        $this->secondSession->endAt(now()->toImmutable());

        $this->assertThrows(fn () => DB::transaction(fn () => $this->addresses()->recipient(ActorIdentity::of($this->second), $this->secondSession->id)), ActorUnavailable::class);
    }

    public function test_the_system_never_receives(): void
    {
        $this->expectException(ActorUnavailable::class);

        $this->addresses()->recipient(ActorIdentity::system(), null);
    }

    public function test_an_agent_sends_from_its_own_session(): void
    {
        $this->startRequestAs($this->first->id, $this->secondSession->id);

        $sender = $this->addresses()->sender();

        $this->assertSame([$this->first->id, $this->secondSession->id], [$sender->actor->id, $sender->sessionId]);
    }

    private function addresses(): MessageAddressReader
    {
        return $this->app->make(MessageAddressReader::class);
    }
}
