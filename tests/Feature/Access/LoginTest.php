<?php

declare(strict_types=1);

namespace Tests\Feature\Access;

use App\Models\Access\User;
use App\Support\Access\AccessSettings;
use Illuminate\Support\Facades\Route;
use Inertia\Testing\AssertableInertia;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

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

    public function test_a_guest_reaching_the_journal_is_sent_to_the_working_login_page(): void
    {
        $this->get('/login-test/journal')->assertRedirect('/login');

        $this->get('/login')->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Login')
            ->where('page.input.email', '')
            ->where('name', config('app.name'))
            ->missing('currentUser'));
    }

    public function test_local_development_fills_the_form_with_the_local_account_and_no_other_environment_does(): void
    {
        config(['web.local_sign_in' => [
            'email' => 'owner@journal.local',
            'password' => 'password',
        ]]);

        $this->app->detectEnvironment(fn () => 'local');

        $this->get('/login')->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.input.email', 'owner@journal.local')
            ->where('page.input.password', 'password'));

        $this->app->detectEnvironment(fn () => 'production');

        $this->get('/login')->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.input.email', '')
            ->where('page.input.password', ''));
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
