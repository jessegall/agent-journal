<?php

declare(strict_types=1);

namespace Tests\Machinery\Hooks;

use App\Enums\Engine\NoSubject;
use App\Support\DomainEntry;
use App\Support\References\StateReference;
use Tests\Fixtures\Modules\Notes\NotesDomain;
use Tests\Support\CommittedHookStack;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\TestCase;

/**
 * A module outside the domain folder, such as a paid or third-party one, declares its own state in its Domain class and
 * plugs it
 * into the core without the core naming it.
 */
#[TestsMachinery(DomainEntry::class)]
final class OutsideModuleStatesTest extends TestCase
{
    use CommittedHookStack;

    private const string NOTE_REASON = 'Finish the note first.';

    public function test_a_module_outside_the_domains_registers_and_pushes_its_own_state(): void
    {
        $this->journal->pushState($this->target, new StateReference('notes.writing', NoSubject::None));

        $this->assertSame(['core.ready', 'notes.writing'], $this->storedTypeKeys());
        $this->assertSame(
            json_encode(['decision' => 'block', 'reason' => self::NOTE_REASON]),
            $this->answerStop(),
        );
    }

    /**
     * The module boots with the application, before the start builds the state registry once.
     */
    protected function refreshApplication(): void
    {
        parent::refreshApplication();

        DomainEntry::fromClass(NotesDomain::class)->boot($this->app);
    }
}
