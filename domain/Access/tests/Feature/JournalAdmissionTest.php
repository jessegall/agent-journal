<?php

declare(strict_types=1);

namespace Domain\Access\Tests\Feature;

use App\Contracts\Admission\JournalAdmission;
use App\Enums\ActorType;
use App\Models\Agents\Agent;
use App\Support\ActorContext;
use Domain\Access\Database\Factories\UserFactory;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Access\Support\OwnerAdmission;
use Domain\Access\Tests\TestCase;
use Illuminate\Support\Facades\Route;
use Tests\Support\RefreshHookDatabase;

final class JournalAdmissionTest extends TestCase
{
    use RefreshHookDatabase;

    private const string OWNER_ACTOR_TEXT = 'user %s';

    protected function setUp(): void
    {
        parent::setUp();

        Route::middleware(['web', 'auth', 'journal.user'])->get(
            '/access-test/actor',
            fn (ActorContext $actor) => "{$actor->type->value} {$actor->id}",
        );
    }

    public function test_the_moved_user_and_its_factory_find_each_other_both_ways(): void
    {
        $this->assertInstanceOf(User::class, User::factory()->make());
        $this->assertInstanceOf(User::class, UserFactory::new()->make());
    }

    public function test_the_configured_owner_becomes_the_user_actor(): void
    {
        $owner = User::factory()->create();
        $this->configureOwner($owner->id);

        $page = $this->actingAs($owner)->get('/access-test/actor')->assertOk();

        $page->assertSeeText(sprintf(self::OWNER_ACTOR_TEXT, $owner->id));
    }

    public function test_another_user_is_refused(): void
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

    public function test_users_and_agents_act_through_the_actor_interface_and_only_the_owner_user_is_let_in(): void
    {
        $owner = User::factory()->create();
        $agent = Agent::create('Planner', 'main-agent');
        $this->configureOwner($owner->id);
        $admission = $this->app->make(JournalAdmission::class);

        $this->assertInstanceOf(OwnerAdmission::class, $admission);
        $this->assertSame([ActorType::User, $owner->id], [$owner->actorType(), $owner->actorId()]);
        $this->assertSame(ActorType::Agent, $agent->actorType());
        $this->assertTrue($admission->admits($owner));
        $this->assertFalse($admission->admits($agent));
    }

    private function configureOwner(string|null $ownerId): void
    {
        $this->app->instance(AccessSettings::class, new AccessSettings($ownerId));
    }
}
