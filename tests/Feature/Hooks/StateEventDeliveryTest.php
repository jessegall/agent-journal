<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Hooks\Actions\StartStacks;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Enums\NoSubject;
use App\Hooks\Events\Support\StateEventScope;
use App\Hooks\Models\PendingAgentMessage;
use App\Hooks\Support\StackTransaction;
use Illuminate\Contracts\Events\Dispatcher;
use Tests\Fixtures\Modules\Notes\Events\NoteWritten;
use Tests\Fixtures\Modules\Notes\Exceptions\NoteWorkFailed;
use Tests\Support\CommittedHookStack;
use Tests\Support\RegistersNoteStates;
use Tests\TestCase;

final class StateEventDeliveryTest extends TestCase
{
    use CommittedHookStack {
        setUpCommittedHookStack as private setUpBaseStack;
    }
    use RegistersNoteStates;

    protected function setUpCommittedHookStack(): void
    {
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
