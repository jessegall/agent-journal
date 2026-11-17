<?php

declare(strict_types=1);

namespace Tests\Feature\Access;

use App\Core\Actors\ActorContext;
use App\Domain\Access\AccessSettings;
use App\Domain\Access\Models\User;
use App\Domain\Access\Models\UserFactory;
use Illuminate\Support\Facades\Route;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

final class JournalAccessTest extends TestCase
{
    use RefreshHookDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Route::middleware(['web', 'auth', 'journal.person'])->get('/access-test/actor', fn (ActorContext $actor) => "{$actor->kind->value} {$actor->id}");
    }

    public function test_the_moved_user_and_its_factory_find_each_other_both_ways(): void
    {
        $this->assertInstanceOf(User::class, User::factory()->make());
        $this->assertInstanceOf(User::class, UserFactory::new()->make());
    }

    public function test_the_configured_owner_becomes_the_person_actor(): void
    {
        $owner = User::factory()->create();
        $this->configureOwner($owner->id);

        $this->actingAs($owner)->get('/access-test/actor')->assertOk()->assertSeeText("person {$owner->id}");
    }

    public function test_another_person_is_refused(): void
    {
        $owner = User::factory()->create();
        $this->configureOwner($owner->id);

        $this->actingAs(User::factory()->create())->get('/access-test/actor')->assertForbidden();
    }

    public function test_nobody_gets_in_while_no_owner_is_configured(): void
    {
        $this->configureOwner(null);

        $this->actingAs(User::factory()->create())->get('/access-test/actor')->assertForbidden();
    }

    private function configureOwner(?int $ownerId): void
    {
        $this->app->instance(AccessSettings::class, new AccessSettings($ownerId));
    }
}
