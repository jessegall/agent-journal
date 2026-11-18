<?php

declare(strict_types=1);

namespace Tests\Feature\Actors;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Enums\ActorType;
use App\Actors\Exceptions\InvalidActorText;
use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorIdentity;
use App\Assignments\Contracts\AssignmentProviders;
use App\Assignments\Exceptions\AssignmentTypeUnavailable;
use App\Assignments\Models\AssignmentRecord;
use App\Bus\Contracts\CommandBus;
use App\Bus\Exceptions\EngineNotAllowed;
use App\Engine\Support\EngineActor;
use App\Web\Commands\RecordUserHeartbeat;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Tasks\Models\Task;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * The engine is an actor of its own type that no request or command line may name, that never holds work, and that a
 * command that does not allow it refuses.
 */
final class EngineActorTypeTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['users', 'tasks', 'assignments', 'user_presences'];

    public function test_the_engine_actor_is_of_the_engine_type(): void
    {
        $engine = new EngineActor;

        $this->assertSame(ActorType::Engine, $engine->actorType());
        $this->assertSame(EngineActor::ID, ActorIdentity::of($engine)->id);
        $this->assertNotContains(ActorType::Engine, ActorType::requestTypes());
    }

    public function test_actor_text_naming_the_engine_is_refused(): void
    {
        $this->expectException(InvalidActorText::class);

        ActorIdentity::fromText('engine:'.EngineActor::ID);
    }

    public function test_a_request_naming_the_engine_as_recipient_is_refused(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $task = Task::factory()->create(['title' => 'Not for the engine']);

        $this->actingAs($owner)->postJson('/assignments/assign', ['recordType' => 'tasks.task', 'recordId' => $task->id, 'recipientType' => 'engine', 'recipientId' => EngineActor::ID])
            ->assertUnprocessable();

        $this->assertSame(0, AssignmentRecord::query()->withoutGlobalScopes()->count());
    }

    public function test_the_engine_never_holds_work(): void
    {
        $this->expectException(AssignmentTypeUnavailable::class);

        $this->app->make(AssignmentProviders::class)->assigneeProvider(ActorType::Engine);
    }

    public function test_a_command_for_users_refuses_the_engine(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::of(new EngineActor));

        $this->expectException(EngineNotAllowed::class);

        $this->app->make(CommandBus::class)->run(new RecordUserHeartbeat);
    }
}
