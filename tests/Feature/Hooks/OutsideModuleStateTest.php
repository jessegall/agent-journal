<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Domains\Support\DomainEntry;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Enums\NoSubject;
use Tests\Fixtures\Modules\Notes\NotesDomain;
use Tests\Support\CommittedHookStack;
use Tests\TestCase;

/**
 * A module outside the domain folder, such as a paid or third-party one, declares its own state in its Domain class and
 * plugs it
 * into the core without the core naming it.
 */
final class OutsideModuleStateTest extends TestCase
{
    use CommittedHookStack;

    public function test_a_module_outside_the_domains_registers_and_pushes_its_own_state(): void
    {
        $this->pushState(new StateReference('notes.writing', NoSubject::None));

        $this->assertSame(['hooks.ready', 'notes.writing'], $this->storedTypeKeys());
        $this->assertSame('{"decision":"block","reason":"Finish the note first."}', $this->answerStop('call-2'));
    }

    /**
     * The module boots with the application, before the launch builds the state registry once.
     */
    protected function refreshApplication(): void
    {
        parent::refreshApplication();

        DomainEntry::fromClass(NotesDomain::class)->boot($this->app);
    }
}
