<?php

declare(strict_types=1);

namespace Tests\Feature\Actors;

use App\Actors\Contracts\PolicyCatalogue;
use App\Actors\Exceptions\AbilityNotRegistered;
use App\Actors\Exceptions\ActorNotAllowed;
use App\Actors\Exceptions\PolicyRegistrationConflict;
use App\Actors\Values\PolicyRegistration;
use App\Contracts\DomainAvailability;
use App\Domains\Support\DomainEntry;
use Illuminate\Contracts\Auth\Access\Gate;
use Tests\Fixtures\Modules\Notes\Enums\NoteAbility;
use Tests\Fixtures\Modules\Notes\Models\Note;
use Tests\Fixtures\Modules\Notes\NotesDomain;
use Tests\Fixtures\Modules\Notes\Policies\NotePolicy;
use Tests\Fixtures\Policies\OtherAbility;
use Tests\Fixtures\Policies\OtherNotePolicy;
use Tests\TestCase;

final class PolicyCatalogueTest extends TestCase
{
    private bool $notesEnabled = true;

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->instance(DomainAvailability::class, new class($this) implements DomainAvailability
        {
            public function __construct(private readonly PolicyCatalogueTest $test) {}

            public function isEnabled(string $owner): bool
            {
                return $owner !== 'Notes' || $this->test->notesEnabled();
            }
        });
    }

    public function notesEnabled(): bool
    {
        return $this->notesEnabled;
    }

    public function test_a_module_registers_a_policy_that_the_gate_uses_for_its_model(): void
    {
        $this->registerNotes();

        $this->assertInstanceOf(NotePolicy::class, $this->app->make(Gate::class)->getPolicyFor(Note::class));
        $this->app->make(PolicyCatalogue::class)->requireGrantable(NotePolicy::class, NoteAbility::Edit);
        $this->addToAssertionCount(1);
    }

    public function test_two_owners_registering_the_same_model_fail_naming_both(): void
    {
        $this->registerNotes();

        $this->expectException(PolicyRegistrationConflict::class);
        $this->expectExceptionMessage('Notes and Cards both register a policy for '.Note::class);

        $this->app->make(PolicyCatalogue::class)->register(
            'Cards',
            new PolicyRegistration(Note::class, OtherNotePolicy::class, NoteAbility::class),
        );
    }

    public function test_an_equal_enum_value_of_another_policy_is_not_the_same_grant(): void
    {
        $this->registerNotes();

        $this->expectException(AbilityNotRegistered::class);

        $this->app->make(PolicyCatalogue::class)->requireGrantable(NotePolicy::class, OtherAbility::Edit);
    }

    public function test_a_switched_off_module_grants_nothing(): void
    {
        $this->registerNotes();
        $this->notesEnabled = false;

        $this->expectException(AbilityNotRegistered::class);

        $this->app->make(PolicyCatalogue::class)->requireGrantable(NotePolicy::class, NoteAbility::Read);
    }

    public function test_a_refused_actor_is_answered_as_forbidden(): void
    {
        $response = ActorNotAllowed::asNonOwner()->render();

        $this->assertSame(403, $response->getStatusCode());
        $this->assertSame(['message' => 'Only an owner of this journal may do this.'], $response->getData(true));
    }

    private function registerNotes(): void
    {
        foreach (DomainEntry::fromClass(NotesDomain::class)->policies() as $registration) {
            $this->app->make(PolicyCatalogue::class)->register('Notes', $registration);
        }
    }
}
