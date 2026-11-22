<?php

declare(strict_types=1);

namespace Tests\Feature\Settings;

use App\Http\Responses\PageActionAnswers;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Inertia\Support\SessionKey;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The settings page's save and reset go back to the page with a notice flashed for the toast region, and a refused
 * request comes back as the page's errors beside its fields.
 */
final class SettingsPageActionsTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_save_and_reset_go_back_with_a_notice(): void
    {
        $owner = $this->owner();

        foreach (['/settings/save', '/settings/reset'] as $action) {
            $this->actingAs($owner)->from('/settings')->post($action, ['owner' => 'Core', 'revision' => 0])
                ->assertRedirect('/settings')
                ->assertStatus(303)
                ->assertSessionHas(SessionKey::FLASH_DATA, fn (array $flash) => is_string($flash[PageActionAnswers::NOTICE] ?? null));
        }
    }

    public function test_a_refused_save_comes_back_as_the_errors_of_its_fields(): void
    {
        $this->actingAs($this->owner())->from('/settings')->post('/settings/save', [])
            ->assertRedirect('/settings')
            ->assertSessionHasErrors(['owner', 'revision'])
            ->assertSessionMissing(SessionKey::FLASH_DATA);
    }

    private function owner(): User
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));

        return $owner;
    }
}
