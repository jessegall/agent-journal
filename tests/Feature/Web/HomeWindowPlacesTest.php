<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Enums\WindowPlace;
use Illuminate\Support\Collection;
use Inertia\Testing\AssertableInertia;
use Tests\Support\ActsAsOwner;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Home tells each window where it sits in a work layout when the window declares a place, so a layout picks windows
 * by place and never by their key.
 */
final class HomeWindowPlacesTest extends TestCase
{
    use ActsAsOwner;
    use RefreshHookDatabase;

    public function test_the_project_file_and_activity_windows_carry_their_places_and_the_others_none(): void
    {
        $this->actingAs($this->owner)->get('/')->assertOk()->assertInertia(
            fn (AssertableInertia $page) => $page->where('page.data.windows', function (Collection $windows): bool {
                $places = $windows->mapWithKeys(fn (array $window) => [$window['key'] => $window['place'] ?? 'none']);

                $this->assertSame(WindowPlace::Tree->value, $places['connections.project']);
                $this->assertSame(WindowPlace::Editor->value, $places['connections.file']);
                $this->assertSame(WindowPlace::Feed->value, $places['web.activity']);
                $this->assertSame(3, $places->reject(fn (string $place) => $place === 'none')->count());

                return true;
            }),
        );
    }
}
