<?php

declare(strict_types=1);

namespace Tests\Unit\Actors;

use App\Access\Contracts\PolicyCatalogue;
use App\Access\Exceptions\PolicyDefinitionConflict;
use App\Access\Values\PolicyDefinition;
use App\Agents\Enums\AccessType;
use App\Bootstrap\Contracts\Domains\DomainAvailability;
use App\Exceptions\ActorNotAllowed;
use App\Exceptions\GrantNotRegistered;
use App\Support\Domain;
use App\Support\DomainEntry;
use App\Support\DomainRegistry;
use Tests\Fixtures\Modules\Notes\Models\Note;
use Tests\Fixtures\Modules\Notes\NotesDomain;
use Tests\Fixtures\Modules\Notes\Policies\NotePolicy;
use Tests\Fixtures\Policies\OtherNotePolicy;
use Tests\TestCase;

final class PolicyCatalogueTest extends TestCase
{
    /**
     * It reads what every installed domain declares, so it boots them all.
     *
     * @return list<class-string<Domain>>
     */
    protected static function bootedDomains(): array
    {
        return DomainRegistry::installedClasses(dirname(__DIR__, 3));
    }

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

    public function test_a_module_registers_a_grant_only_policy_that_names_its_model(): void
    {
        $this->registerNotes();

        $this->app->make(PolicyCatalogue::class)->assertGrantable(NotePolicy::class, AccessType::Edit);
        $this->assertSame(Note::class, $this->app->make(PolicyCatalogue::class)->definitionOf(NotePolicy::class)->model());
    }

    public function test_two_owners_registering_the_same_model_fail_naming_both(): void
    {
        $this->registerNotes();

        $this->expectException(PolicyDefinitionConflict::class);
        $this->expectExceptionMessage(PolicyDefinitionConflict::forModel(Note::class, 'Notes', 'Cards')->getMessage());

        $this->app->make(PolicyCatalogue::class)->register(
            'Cards',
            new PolicyDefinition(OtherNotePolicy::class, [AccessType::Read, AccessType::Create, AccessType::Edit, AccessType::Delete]),
        );
    }

    public function test_an_access_the_policy_does_not_accept_is_not_grantable(): void
    {
        $this->registerNotes();

        $this->expectException(GrantNotRegistered::class);

        $this->app->make(PolicyCatalogue::class)->assertGrantable(NotePolicy::class, AccessType::Build);
    }

    public function test_a_switched_off_module_grants_nothing(): void
    {
        $this->registerNotes();
        $this->notesEnabled = false;

        $this->expectException(GrantNotRegistered::class);

        $this->app->make(PolicyCatalogue::class)->assertGrantable(NotePolicy::class, AccessType::Read);
    }

    public function test_a_refused_actor_is_answered_as_forbidden(): void
    {
        $response = ActorNotAllowed::asNonOwner()->render();

        $this->assertSame(403, $response->getStatusCode());
        $this->assertSame(['message' => 'Only an owner of this journal may do this.'], $response->getData(true));
    }

    private function registerNotes(): void
    {
        foreach (DomainEntry::fromClass(NotesDomain::class)->policies() as $definition) {
            $this->app->make(PolicyCatalogue::class)->register('Notes', $definition);
        }
    }
}
