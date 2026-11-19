<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Feature;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Agents\Actions\LaunchSessions;
use App\Agents\Enums\AgentRole;
use App\Agents\Models\Agent;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Assignments\Storage\AssignmentStore;
use App\Bus\Contracts\CommandBus;
use App\Bus\Support\RequestKey;
use App\Communication\Commands\SendMessage;
use App\Communication\Models\Message;
use App\Desks\Commands\CreateDesk;
use App\Desks\Contracts\SeatingWriter;
use App\Desks\Models\DeskRecord;
use App\Desks\Models\DeskSeat;
use App\Desks\Support\SeatChange;
use App\Records\Support\RecordIdentity;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Chat\Commands\DockRecord;
use Domain\Chat\Commands\HideDockedRecord;
use Domain\Chat\Commands\RestoreDockedRecord;
use Domain\Chat\Models\DockedRecord;
use Domain\Chat\Resolvers\Support\DockedRecordRecords;
use Domain\Chat\Support\ConversationPair;
use Domain\Chat\Tests\TestCase;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\Support\WritesInboxMessages;

/**
 * A docked record is its owner's placement in one conversation: docking, hiding and restoring change only that
 * placement, docking twice keeps one, and a record the owner can no longer read is left out while its placement stays.
 */
final class RecordDockTest extends TestCase
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
        'docked_records',
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

    public function test_docking_hiding_and_restoring_change_only_the_one_placement(): void
    {
        $this->asAgent($this->builder);
        $this->dock(new DockRecord($this->ownInboxId, $this->desk->inboxId(), $this->record()));
        $this->dock(new DockRecord($this->ownInboxId, $this->desk->inboxId(), $this->record()));

        $this->assertSame(1, DockedRecord::query()->withoutGlobalScopes()->count());
        $this->assertEquals([$this->record()], $this->docked(false));

        $this->dock(new HideDockedRecord($this->ownInboxId, $this->desk->inboxId(), $this->record()));
        $this->assertSame([], $this->docked(false));
        $this->assertEquals([$this->record()], $this->docked(true));

        $this->dock(new RestoreDockedRecord($this->ownInboxId, $this->desk->inboxId(), $this->record()));
        $this->assertEquals([$this->record()], $this->docked(false));
        $this->assertSame('Pin me.', Message::query()->withoutGlobalScopes()->findOrFail($this->messageId)->body);
    }

    public function test_an_unreadable_record_is_left_out_but_its_placement_stays(): void
    {
        $this->asAgent($this->builder);
        $this->dock(new DockRecord($this->ownInboxId, $this->desk->inboxId(), $this->record()));

        $this->replaceOccupant($this->reviewer[0]);
        $this->asAgent($this->builder);

        $this->assertSame([], $this->docked(false));
        $this->assertSame(1, DockedRecord::query()->withoutGlobalScopes()->count());
    }

    private function dock(object $command): void
    {
        $this->runOnBus($command);
    }

    /**
     * @return list<RecordIdentity>
     */
    private function docked(bool $hidden): array
    {
        return $this->app->make(DockedRecordRecords::class)->docked(new ConversationPair($this->ownInboxId, $this->desk->inboxId()), $hidden);
    }

    private function record(): RecordIdentity
    {
        return new RecordIdentity(Message::LINK_TYPE, $this->messageId);
    }

    private function seat(string $agentId): void
    {
        $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(SeatingWriter::class)
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
            $this->app->make(SeatingWriter::class)
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
        $agent = Agent::named($name, AgentRole::MainAgent);
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
