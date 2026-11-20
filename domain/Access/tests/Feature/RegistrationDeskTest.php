<?php

declare(strict_types=1);

namespace Domain\Access\Tests\Feature;

use App\Communication\Contracts\ActorInboxResolver;
use Domain\Access\Actions\CreateNewUser;
use Domain\Access\Models\User;
use Domain\Access\Tests\TestCase;
use Tests\Support\CommitsHookRows;

/**
 * A user who registers gets their own desk at once, so they have an inbox to send from and be written to.
 */
final class RegistrationDeskTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'users',
        'inboxes',
        'desks',
        'desk_seats',
        'desk_preferences',
        'assignments',
        'command_receipts',
    ];

    public function test_a_registered_user_has_their_own_inbox(): void
    {
        $user = $this->app->make(CreateNewUser::class)->create([
            'name' => 'Ada',
            'email' => 'ada@example.test',
            'password' => 'a long enough password 123!',
            'password_confirmation' => 'a long enough password 123!',
        ]);

        $inbox = $this->app->make(ActorInboxResolver::class)->preferredFor($user);

        $this->assertSame('Ada', $inbox->inboxLabel());
        $this->assertSame(1, User::query()->count());
    }
}
