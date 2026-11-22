<?php

declare(strict_types=1);

namespace Domain\Access\Tests\Feature;

use App\Contracts\Actors\CurrentUserResolver;
use App\Support\CurrentUser;
use Domain\Access\Models\User;
use Domain\Access\Tests\TestCase;
use Tests\Support\RefreshHookDatabase;

/**
 * Access hands other domains the signed-in user as the current user: id and display name, nothing for a guest.
 */
final class CurrentUserResolverTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_guest_has_no_current_user(): void
    {
        $this->assertTrue($this->app->make(CurrentUserResolver::class)->currentUser()->isEmpty());
    }

    public function test_the_current_user_comes_with_only_id_and_name(): void
    {
        $user = User::factory()->create(['name' => 'Owner']);
        $this->actingAs($user);

        $this->assertEquals(
            new CurrentUser($user->id, 'Owner'),
            $this->app->make(CurrentUserResolver::class)->currentUser()->get(),
        );
    }
}
