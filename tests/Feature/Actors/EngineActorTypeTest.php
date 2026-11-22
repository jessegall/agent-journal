<?php

declare(strict_types=1);

namespace Tests\Feature\Actors;

use App\Contracts\AssignmentProviders;
use App\Enums\ActorType;
use App\Exceptions\AssignmentTypeUnavailable;
use App\Exceptions\InvalidActorText;
use App\Models\AssignmentRecord;
use App\Support\ActorIdentity;
use App\Support\EngineActor;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Tasks\Models\Task;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * The engine is an actor of its own type that no request or command line may name and that never holds work.
 */
final class EngineActorTypeTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['users', 'tasks', 'assignments', 'user_presences'];

    public function test_the_engine_actor_is_of_the_engine_type(): void
    {
        $engine = new EngineActor();

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

        $this->actingAs($owner)->postJson(
            '/assignments/assign',
            [
                'recordType' => 'tasks.task',
                'recordId' => $task->id,
                'recipientType' => 'engine',
                'recipientId' => EngineActor::ID,
            ],
        )
            ->assertUnprocessable();

        $this->assertSame(0, AssignmentRecord::query()->withoutGlobalScopes()->count());
    }

    public function test_the_engine_never_holds_work(): void
    {
        $this->expectException(AssignmentTypeUnavailable::class);

        $this->app->make(AssignmentProviders::class)->assigneeProvider(ActorType::Engine->value);
    }
}
