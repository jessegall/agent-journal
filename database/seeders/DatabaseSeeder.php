<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Domain\Access\Database\Seeders\OwnerSeeder;
use App\Domain\Plans\Database\Seeders\PlansSeeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([OwnerSeeder::class, PlansSeeder::class]);
    }
}
