<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Core\Hooks\Decisions\StateReference;
use App\Core\Hooks\Enums\NoSubject;
use App\Core\Hooks\Events\StateTypesRequested;
use App\Domain\DomainRegistry;
use Illuminate\Contracts\Events\Dispatcher;
use Tests\Fixtures\Modules\Cards\CardsDomain;
use Tests\Fixtures\Modules\Notes\NotesDomain;
use Tests\Support\CommittedHookStack;
use Tests\TestCase;

/**
 * A module outside app/Domain, such as a paid or third-party one, declares its own state in its Domain class and plugs it
 * into the core without the core naming it.
 */
final class OutsideModuleStateTest extends TestCase
{
    use CommittedHookStack;

    public function test_a_module_outside_the_domains_registers_and_pushes_its_own_state(): void
    {
        $notes = DomainRegistry::from([CardsDomain::class, NotesDomain::class]);
        $this->app->make(Dispatcher::class)->listen(StateTypesRequested::class, fn (StateTypesRequested $event) => $notes->registerStatesIn($event->registry, $this->app));

        $this->pushState(new StateReference('notes.writing', NoSubject::None));

        $this->assertSame(['hooks.main_ready', 'notes.writing'], $this->storedTypeKeys());
        $this->assertSame('{"decision":"block","reason":"Finish the note first."}', $this->answerStop('call-2'));
    }
}
