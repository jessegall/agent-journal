<?php

declare(strict_types=1);

namespace Tests\Feature\Settings;

use App\Http\Responses\PageActionAnswers;
use App\Models\Access\User;
use App\Support\Access\AccessSettings;
use Inertia\Support\SessionKey;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The settings page's actions: a save goes back quietly, as the page saves each change as it is made; a reset goes
 * back with a notice flashed for the toast region; a switch turns a group off and on; and a refused request, such as
 * a change against an older revision, comes back as the page's errors.
 */
final class SettingsPageActionsTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_save_goes_back_quietly_and_a_reset_goes_back_with_a_notice(): void
    {
        $owner = $this->owner();

        $this->actingAs($owner)->from('/settings')
            ->post('/settings/save', ['owner' => 'Core', 'group' => 'general', 'revision' => 0])
            ->assertRedirect('/settings')
            ->assertStatus(303)
            ->assertSessionMissing(SessionKey::FLASH_DATA);

        $this->actingAs($owner)->from('/settings')
            ->post('/settings/reset', ['owner' => 'Core', 'group' => 'general', 'revision' => 0])
            ->assertRedirect('/settings')
            ->assertStatus(303)
            ->assertSessionHas(SessionKey::FLASH_DATA, fn (array $flash) => is_string($flash[PageActionAnswers::NOTICE] ?? null));
    }

    public function test_a_switch_turns_a_domain_off_and_on_again(): void
    {
        $owner = $this->owner();

        $switch = fn (bool $isOn, int $revision) => $this->actingAs($owner)->from('/settings')->post('/settings/switch', [
            'owner' => 'Core',
            'group' => 'domain_tasks',
            'revision' => $revision,
            'enabled' => $isOn ? '1' : '0',
        ]);

        $switch(false, 0)->assertRedirect('/settings');
        $this->assertFalse($this->isTasksSwitchOn($owner));

        $switch(true, 1)->assertRedirect('/settings');
        $this->assertTrue($this->isTasksSwitchOn($owner));
    }

    public function test_a_change_against_an_older_revision_is_refused_in_place(): void
    {
        $owner = $this->owner();

        $this->actingAs($owner)->from('/settings')
            ->post('/settings/save', ['owner' => 'Core', 'group' => 'general', 'revision' => 0, 'display_name' => 'One']);

        $this->actingAs($owner)->from('/settings')
            ->post('/settings/save', ['owner' => 'Core', 'group' => 'general', 'revision' => 0, 'display_name' => 'Two'])
            ->assertRedirect('/settings')
            ->assertSessionHasErrors();
    }

    public function test_a_refused_save_comes_back_as_the_errors_of_its_fields(): void
    {
        $this->actingAs($this->owner())->from('/settings')->post('/settings/save', [])
            ->assertRedirect('/settings')
            ->assertSessionHasErrors(['owner', 'revision'])
            ->assertSessionMissing(SessionKey::FLASH_DATA);
    }

    /**
     * Whether the Tasks switch on the settings page the owner opens now stands on.
     */
    private function isTasksSwitchOn(User $owner): bool
    {
        $groups = $this->actingAs($owner)->get('/settings')->viewData('page')['props']['page']['data']['root']['children'][1]['children'];

        foreach ($groups as $group) {
            if ($group['key'] === 'domain_tasks') {
                return collect($group['children'])->firstWhere('key', 'switch')['children'][0]['field']['value'] === '1';
            }
        }

        $this->fail('The settings page shows no Tasks switch.');
    }

    private function owner(): User
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));

        return $owner;
    }
}
