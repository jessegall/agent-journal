<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Feature;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Agents\Actions\LaunchSessions;
use App\Agents\Models\Agent;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Assignments\Storage\AssignmentStore;
use App\Bus\Contracts\CommandBus;
use App\Bus\Support\RequestKey;
use App\Communication\Commands\SendMessage;
use App\Communication\Exceptions\MessageMissing;
use App\Desks\Commands\CreateDesk;
use App\Desks\Models\DeskRecord;
use App\Desks\Models\DeskSeat;
use App\Desks\Support\DeskSeating;
use App\Desks\Support\SeatChange;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Chat\Commands\PinMessage;
use Domain\Chat\Models\MessagePin;
use Domain\Chat\Resolvers\Support\MessagePinRecords;
use Domain\Chat\Tests\TestCase;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\Support\WritesInboxMessages;

/**
 * A pin is its owner's alone, one per message and conversation, made only on a message the owner can read, and
 * listed only while the owner still can: it hides when access goes and comes back with it.
 */
final class MessagePinTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;
    use WritesInboxMessages;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'launch_credentials',
        'agent_stacks',
        'inboxes',
        'desks',
        'desk_seats',
        'desk_preferences',
        'assignments',
        'command_receipts',
        'messages',
        'message_attentions',
        'message_pins',
    ];

    private User $owner;

    /**
     * @var array{string, string}
     */
    private array $builder;

    /**
     * @var array{string, string}
     */
    private array $reviewer;

    private DeskRecord $desk;

    private string $ownInboxId;

    private string $messageId;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->builder = $this->launch('Builder');
        $this->reviewer = $this->launch('Reviewer');
        $this->startUserRequestAs($this->owner->id);
        $this->ownInboxId = $this->inboxOf(ActorIdentity::of($this->owner))->inboxId();
        $this->desk = DeskRecord::query()->findOrFail($this->runOnBus(new CreateDesk('Team', 1, false)));
        $this->seat($this->builder[0]);
        $this->messageId = $this->runOnBus(new SendMessage($this->ownInboxId, $this->desk->inboxId(), 'Pin me.'));
    }

    public function test_pinning_twice_keeps_one_pin_and_leaves_other_pins_alone(): void
    {
        $this->asAgent($this->builder);
        $this->pin();
        $this->pin();

        $this->assertSame(1, MessagePin::query()->withoutGlobalScopes()->count());
        $this->assertSame([$this->messageId], array_column($this->pinned(), 'id'));

        $this->asAgent($this->reviewer);
        $this->assertSame([], $this->pinned());
    }

    public function test_a_message_the_asker_cannot_read_is_refused(): void
    {
        $this->asAgent($this->reviewer);

        $this->expectException(MessageMissing::class);

        $this->pin();
    }

    public function test_a_pin_hides_while_access_is_gone_and_returns_with_it(): void
    {
        $this->asAgent($this->builder);
        $this->pin();

        $this->replaceOccupant($this->reviewer[0]);
        $this->asAgent($this->builder);
        $this->assertSame([], $this->pinned());

        $this->replaceOccupant($this->builder[0]);
        $this->asAgent($this->builder);
        $this->assertSame([$this->messageId], array_column($this->pinned(), 'id'));
    }

    private function pin(): void
    {
        $this->runOnBus(new PinMessage($this->ownInboxId, $this->desk->inboxId(), $this->messageId));
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function pinned(): array
    {
        return array_map(fn ($view) => $view->toArray(), $this->app->make(MessagePinRecords::class)->pinned());
    }

    private function seat(string $agentId): void
    {
        $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(DeskSeating::class)
                ->seat($this->desk->id, new ActorIdentity(ActorType::Agent, $agentId)),
        );
    }

    private function replaceOccupant(string $agentId): void
    {
        $this->app->forgetScopedInstances();
        $this->startUserRequestAs($this->owner->id);
        $seat = DeskSeat::query()->ofDesk($this->desk)->sole();
        $this->app->make(AssignmentTransaction::class)->run(function () use ($seat, $agentId): void {
            $current = $this->app->make(AssignmentStore::class)->lockCurrent($seat->assignmentIdentity())->get();
            $successor = new ActorIdentity(ActorType::Agent, $agentId);
            $this->app->make(DeskSeating::class)
                ->replace(new SeatChange($this->desk->id, $seat->id, $current->reference, $successor));
        });
    }

    /**
     * @param  array{string, string}  $agent
     */
    private function asAgent(array $agent): void
    {
        $this->app->forgetScopedInstances();
        $this->startRequestAs($agent[0], $agent[1]);
    }

    /**
     * @return array{string, string} the agent id and its session id
     */
    private function launch(string $name): array
    {
        $agent = Agent::named($name, 'main-agent');
        $session = $this->app->make(LaunchSessions::class)
            ->launch($agent, TestSelections::of('claude-code'), TestSelections::requestId())
            ->session;

        return [$agent->id, $session->id];
    }

    private function runOnBus(object $command): mixed
    {
        $this->app->make(RequestKey::class)->set((string) Str::ulid());

        return $this->app->make(CommandBus::class)->run($command);
    }
}
