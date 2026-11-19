<?php

declare(strict_types=1);

namespace Tests\Unit\Skills;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Enums\ActorType;
use App\Actors\Exceptions\InvalidActorText;
use App\Actors\Support\ActorIdentity;
use App\Actors\Support\ActorStore;
use Tests\TestCase;

/**
 * The skill supervisor's console runs act as the journal itself only through the actor store's trusted entry; text from
 * a request can never name the system, and the system actor never outlives the work it ran.
 */
final class SystemActorBoundaryTest extends TestCase
{
    public function test_a_console_run_acts_as_the_system_and_gives_the_actor_back(): void
    {
        $store = $this->app->make(ActorStore::class);

        $type = $store->actAsSystem('test', fn () => $this->app->make(CurrentActor::class)->actor()->actorType());

        $this->assertSame(ActorType::System, $type);
        $this->assertFalse($store->hasActor());
    }

    public function test_request_text_cannot_name_the_system(): void
    {
        $this->expectException(InvalidActorText::class);

        ActorIdentity::fromText('system:01jd8x0g9m3qz6v4k2t7r5w1ce');
    }

    public function test_the_setup_script_refreshes_skills_right_after_migrating(): void
    {
        $setup = json_decode((string) file_get_contents(base_path('composer.json')), true, flags: JSON_THROW_ON_ERROR)['scripts']['setup'];
        $migrate = array_search('@php artisan migrate --force', $setup, true);

        $this->assertIsInt($migrate);
        $this->assertContains('@php artisan skill:refresh', array_slice($setup, $migrate + 1, 2));
    }
}
