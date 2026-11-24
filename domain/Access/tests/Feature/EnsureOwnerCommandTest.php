<?php

declare(strict_types=1);

namespace Domain\Access\Tests\Feature;

use App\Models\Desks\DeskRecord;
use Domain\Access\Models\User;
use Domain\Access\Tests\TestCase;
use Illuminate\Support\Facades\Hash;
use Tests\Support\CommitsHookRows;

/**
 * The owner account named by the installation's settings exists with their password after every install,
 * so its login stays the same across resets; without both settings no account is made.
 */
final class EnsureOwnerCommandTest extends TestCase
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

    public function test_it_makes_the_owner_with_its_desk_once(): void
    {
        config(['access.owner_email' => 'owner@journal.test', 'access.owner_password' => 'first-secret']);

        $this->artisan('access:owner-ensure')->assertSuccessful();
        $desks = DeskRecord::query()->withoutGlobalScopes()->count();
        $this->artisan('access:owner-ensure')->assertSuccessful();

        $owner = User::query()->where('email', 'owner@journal.test')->sole();
        $this->assertTrue(Hash::check('first-secret', $owner->password));
        $this->assertGreaterThan(0, $desks);
        $this->assertSame($desks, DeskRecord::query()->withoutGlobalScopes()->count());
    }

    public function test_a_changed_password_setting_resets_the_owner_password(): void
    {
        config(['access.owner_email' => 'owner@journal.test', 'access.owner_password' => 'first-secret']);
        $this->artisan('access:owner-ensure')->assertSuccessful();

        config(['access.owner_password' => 'second-secret']);
        $this->artisan('access:owner-ensure')->assertSuccessful();

        $owner = User::query()->where('email', 'owner@journal.test')->sole();
        $this->assertTrue(Hash::check('second-secret', $owner->password));
    }

    public function test_without_a_password_setting_no_account_is_made(): void
    {
        config(['access.owner_email' => 'owner@journal.test', 'access.owner_password' => null]);

        $this->artisan('access:owner-ensure')->assertSuccessful();

        $this->assertSame(0, User::query()->count());
    }
}
