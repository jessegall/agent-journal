<?php

declare(strict_types=1);

namespace Tests\Feature\Access;

use App\Models\Access\User;
use App\Models\Inboxes\Inbox;
use Database\Seeders\OwnerSeeder;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * Foundation permissions: the owner seeder reaches the bus through the exported JournalCommands contract, and
 * seeding twice makes the owner and provisions its inbox once.
 */
final class OwnerSeederTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'users',
        'inboxes', 'inbox_members',
        'assignments',
        'command_receipts',
    ];

    public function test_seeding_twice_makes_the_owner_and_provisions_its_inbox_once(): void
    {
        $this->seed(OwnerSeeder::class);
        $inboxes = Inbox::query()->withoutGlobalScopes()->count();
        $this->seed(OwnerSeeder::class);

        $this->assertSame(1, User::query()->count());
        $this->assertGreaterThan(0, $inboxes);
        $this->assertSame($inboxes, Inbox::query()->withoutGlobalScopes()->count());
    }
}
