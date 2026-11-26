<?php

declare(strict_types=1);

namespace Tests\Machinery\Access;

use App\Access\AccessSettings;
use App\Models\Access\User;
use Illuminate\Support\Facades\Route;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

#[TestsMachinery(AccessSettings::class)]
final class LoginTest extends TestCase
{
    use RefreshHookDatabase;

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        Route::middleware([
            'web',
            'auth',
            'journal.user',
        ])->get('/login-test/journal', fn () => 'inside');
        $this->owner = User::factory()->create([
            'email' => 'owner@journal.local',
            'password' => 'secret-password',
        ]);
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
    }

    public function test_the_owner_signs_in_lands_on_plans_and_signs_out(): void
    {
        $this->post('/login', [
            'email' => 'owner@journal.local',
            'password' => 'secret-password',
        ])->assertRedirect('/');
        $this->assertAuthenticatedAs($this->owner);
        $this->get('/login-test/journal')->assertOk();

        $this->post('/logout')->assertRedirect('/');
        $this->assertGuest();
    }

    public function test_a_wrong_password_shows_the_framework_validation(): void
    {
        $this->from('/login')->post('/login', [
            'email' => 'owner@journal.local',
            'password' => 'wrong',
        ])
            ->assertRedirect('/login')
            ->assertSessionHasErrors('email');

        $this->assertGuest();
    }

    public function test_registration_and_the_other_account_screens_are_off(): void
    {
        $this->post(
            '/register',
            [
                'name' => 'Someone',
                'email' => 'someone@example.com',
                'password' => 'secret-password',
            ],
        )->assertNotFound();

        $this->get('/user/two-factor-qr-code')->assertNotFound();
    }
}
