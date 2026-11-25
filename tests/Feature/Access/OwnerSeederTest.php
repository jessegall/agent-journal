<?php

declare(strict_types=1);

namespace Tests\Feature\Access;

use App\Models\Desks\DeskRecord;
use Database\Seeders\OwnerSeeder;
use App\Models\Access\User;
use Tests\TestCase;
use Tests\Support\CommitsHookRows;

/**
 * Foundation permissions: the owner seeder reaches the bus through the exported JournalCommands contract, and
 * seeding twice makes the owner and provisions its desk once.
 */
final class OwnerSeederTest extends TestCase
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

    public function test_seeding_twice_makes_the_owner_and_provisions_its_desk_once(): void
    {
        $this->seed(OwnerSeeder::class);
        $seats = DeskRecord::query()->withoutGlobalScopes()->count();
        $this->seed(OwnerSeeder::class);

        $this->assertSame(1, User::query()->count());
        $this->assertGreaterThan(0, $seats);
        $this->assertSame($seats, DeskRecord::query()->withoutGlobalScopes()->count());
    }
}
