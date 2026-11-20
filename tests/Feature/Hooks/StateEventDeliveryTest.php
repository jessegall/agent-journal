<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Exceptions\ActorNotAllowed;
use App\Actors\Support\ActorContext;
use App\Hooks\Actions\AgentStacks;
use App\Hooks\Actions\StartStacks;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Enums\NoSubject;
use App\Hooks\Events\Support\StateEventScope;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Models\PendingAgentMessage;
use App\Hooks\Stack\StackRestorer;
use App\Hooks\Stack\StateTypes;
use App\Hooks\Support\StackTransaction;
use App\Profiles\Values\ProfileBase;
use Illuminate\Contracts\Events\Dispatcher;
use Tests\Fixtures\Modules\Notes\Commands\RecordNoteEffect;
use Tests\Fixtures\Modules\Notes\Events\NoteWritten;
use Tests\Fixtures\Modules\Notes\Exceptions\NoteWorkFailed;
use Tests\Fixtures\Modules\Notes\Support\NoteEffects;
use Tests\Support\CommittedHookStack;
use Tests\Support\InstallsCommandModules;
use Tests\Support\RegistersNoteStates;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;

final class StateEventDeliveryTest extends TestCase
{
    use CommittedHookStack {
        setUpCommittedHookStack as private setUpBaseStack;
    }
    use InstallsCommandModules, RegistersNoteStates;

    protected function setUpCommittedHookStack(): void
    {
        $this->installCommandRegistry();
        $this->providerWithNotes()->boot();
        $this->setUpBaseStack();
    }

    public function test_an_empty_highest_result_shadows_lower_ordinary_listeners_and_keeps_the_marked_context(): void
    {
        $this->pushState(new StateReference('notes.writing', NoSubject::None));
        $this->pushState(new StateReference('notes.watching', new SubjectReference('Hidden.', 1)));
        $this->pushState(new StateReference('notes.watching', NoSubject::None));

        $this->dispatch(new NoteWritten());

        $this->assertSame(['A note was written.'], $this->takeContext());
    }

    public function test_a_failed_collection_keeps_no_context_from_any_selected_listener(): void
    {
        $this->pushState(new StateReference('notes.writing', NoSubject::None));
        $this->pushState(new StateReference('notes.watching', new SubjectReference('Partial context.', 1)));

        try {
            $this->dispatch(new NoteWritten(listenerFails: true));
            $this->fail('The failing state returned successfully.');
        } catch (NoteWorkFailed) {
            $this->assertSame([], $this->takeContext());
        }

        $this->dispatch(new NoteWritten());
        $this->assertSame(['Partial context.', 'A note was written.'], $this->takeContext());
    }

    public function test_a_closed_stack_has_no_recipient(): void
    {
        $this->pushState(new StateReference('notes.writing', NoSubject::None));
        $this->app->make(StackTransaction::class)->run(
            fn () => $this->app->make(StartStacks::class)->close($this->target),
        );

        $this->dispatch(new NoteWritten());

        $this->assertSame([], $this->takeContext());
    }

    public function test_covering_a_highest_ordinary_match_drops_its_effects_and_keeps_the_marked_origin(): void
    {
        $this->pushState(new StateReference('notes.writing', NoSubject::None));
        $this->pushState(new StateReference('notes.watching', new SubjectReference('Original context.', 1)));
        $this->pushState(new StateReference('guide', NoSubject::None));

        $effects = $this->app->make(NoteEffects::class);
        $effects->afterRecording(function (RecordNoteEffect $command): void {
            if ($command->label === 'cover') {
                $this->app->make(AgentStacks::class)->push(
                    $this->target,
                    new StateReference('notes.watching', new SubjectReference('New cover.', 1)),
                );
            }
        });

        $this->dispatch(new NoteWritten(
            ordinary: [new RecordNoteEffect('cover'), new RecordNoteEffect('stale')],
            marked: [new RecordNoteEffect('marked first'), new RecordNoteEffect('marked second')],
        ));

        $this->assertSame(['cover', 'marked first', 'marked second'], $effects->labels);
        $this->assertSame(['Original context.', 'A note was written.'], $this->takeContext());
    }

    public function test_a_recreated_frame_does_not_receive_the_old_occurrences_remaining_effects(): void
    {
        $reference = new StateReference('notes.watching', NoSubject::None);
        $this->pushState($reference);
        $effects = $this->app->make(NoteEffects::class);
        $effects->afterRecording(function (RecordNoteEffect $command) use ($reference): void {
            if ($command->label === 'replace') {
                $row = AgentStackRow::lockAuthorizedFor($this->target);
                $stack = $this->app->make(StackRestorer::class)->restore($row->frames);
                $without = $stack->poppedOf($stack->top());
                $row->saveFrames($without->records(), $this->app->make(StateTypes::class)->ticking());
                $this->app->make(AgentStacks::class)->push($this->target, $reference);
            }
        });

        $this->dispatch(new NoteWritten(ordinary: [new RecordNoteEffect('replace'), new RecordNoteEffect('stale')]));

        $this->assertSame(['replace'], $effects->labels);
    }

    public function test_a_live_origin_does_not_bypass_the_original_actors_command_authorization(): void
    {
        $this->pushState(new StateReference('notes.watching', new SubjectReference('Still retained.', 1)));
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent($this->target->agentId),
            TestStartAuthority::granting(ProfileBase::mainAgent(), []),
        );

        try {
            $this->dispatch(new NoteWritten(ordinary: [new RecordNoteEffect('unauthorized')]));
            $this->fail('The command ran without authority.');
        } catch (ActorNotAllowed) {
            $this->assertSame([], $this->app->make(NoteEffects::class)->labels);
            $this->assertSame(['Still retained.'], $this->takeContext());
        }
    }

    private function dispatch(NoteWritten $event): void
    {
        $scope = $this->app->make(StateEventScope::class);
        $dispatcher = $this->app->make(Dispatcher::class);
        $scope->admit([$this->target], fn () => $dispatcher->dispatch($event));
    }

    /**
     * @return list<string>
     */
    private function takeContext(): array
    {
        return $this->app->make(StackTransaction::class)->run(
            fn () => PendingAgentMessage::takeAllFor($this->target->actorIdentity()),
        );
    }
}
