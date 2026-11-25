<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Support;

use App\Commands\Desks\CreateDesk\CreateDeskCommand;
use App\Commands\Messages\SendMessage\SendMessageCommand;
use App\Contracts\Assignments\AssignmentTransaction;
use App\Enums\Assignments\ActorType;
use App\Models\Access\User;
use App\Models\Desks\DeskRecord;
use App\Models\Desks\DeskSeat;
use App\Support\Access\AccessSettings;
use App\Support\ActorIdentity;
use App\Support\DeskSeatService;
use App\Support\SeatChange;
use App\Support\Storage\AssignmentStore;
use Tests\Support\StartsMainAgents;

/**
 * The owner, two started agents and a team desk with the builder seated, holding one message the owner sent the
 * desk; with the helpers that seat, replace and act as those agents.
 */
trait OpensTeamDeskMessage
{
    use StartsMainAgents;

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

    protected function setUpOpensTeamDeskMessage(): void
    {
        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->builder = $this->startMainAgent('Builder');
        $this->reviewer = $this->startMainAgent('Reviewer');
        $this->startUserRequestAs($this->owner->id);
        $this->ownInboxId = $this->inboxOf(ActorIdentity::of($this->owner))->inboxId();
        $this->desk = DeskRecord::query()->findOrFail($this->runOnBus(new CreateDeskCommand('Team', 1, false)));
        $this->seat($this->builder[0]);

        $this->messageId = $this->runOnBus(
            new SendMessageCommand($this->ownInboxId, $this->desk->inboxId(), 'Pin me.'),
        );
    }

    private function seat(string $agentId): void
    {
        $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(DeskSeatService::class)
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

            $this->app->make(DeskSeatService::class)
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
}
