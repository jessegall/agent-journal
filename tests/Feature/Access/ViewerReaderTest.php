<?php

declare(strict_types=1);

namespace Tests\Feature\Access;

use App\Domain\Access\Api\Viewer;
use App\Domain\Access\Contracts\ViewerReader;
use App\Domain\Access\Models\User;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Access hands other domains the signed-in user as a viewer: id and display name, nothing for a guest.
 */
final class ViewerReaderTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_guest_has_no_viewer(): void
    {
        $this->assertNull($this->app->make(ViewerReader::class)->viewer());
    }

    public function test_the_signed_in_user_is_the_viewer_with_only_id_and_name(): void
    {
        $user = User::factory()->create(['name' => 'Owner']);
        $this->actingAs($user);

        $this->assertEquals(new Viewer($user->id, 'Owner'), $this->app->make(ViewerReader::class)->viewer());
    }
}
