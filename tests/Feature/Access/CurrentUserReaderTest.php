<?php

declare(strict_types=1);

namespace Tests\Feature\Access;

use App\Core\Actors\Support\CurrentUser;
use App\Core\Web\Contracts\CurrentUserReader;
use App\Domain\Access\Models\User;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Access hands other domains the signed-in user as the current user: id and display name, nothing for a guest.
 */
final class CurrentUserReaderTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_guest_has_no_current_user(): void
    {
        $this->assertTrue($this->app->make(CurrentUserReader::class)->currentUser()->isEmpty());
    }

    public function test_the_current_user_comes_with_only_id_and_name(): void
    {
        $user = User::factory()->create(['name' => 'Owner']);
        $this->actingAs($user);

        $this->assertEquals(new CurrentUser($user->id, 'Owner'), $this->app->make(CurrentUserReader::class)->currentUser()->get());
    }
}
