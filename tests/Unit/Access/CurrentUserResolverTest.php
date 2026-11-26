<?php

declare(strict_types=1);

namespace Tests\Unit\Access;

use App\Actors\Contracts\CurrentUserResolver;
use App\Models\Access\User;
use Tests\TestCase;

/**
 * Access hands other domains the signed-in user as the current user: id and display name, nothing for a guest.
 */
final class CurrentUserResolverTest extends TestCase
{
    public function test_a_guest_has_no_current_user(): void
    {
        $this->assertTrue($this->app->make(CurrentUserResolver::class)->currentUser()->isEmpty());
    }
}
