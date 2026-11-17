<?php

declare(strict_types=1);

namespace App\Domain\Access\Database\Seeders;

use App\Domain\Access\Models\User;
use Illuminate\Database\Seeder;

/**
 * Creates the local owner account, so the running app can be signed into. Set JOURNAL_OWNER_ID to its id (1 on a fresh
 * database); creating it grants nothing by itself.
 */
final class OwnerSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->firstOrCreate(['email' => 'owner@journal.local'], ['name' => 'Owner', 'password' => 'password']);
    }
}
