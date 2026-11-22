<?php

declare(strict_types=1);

namespace Database\Seeders;

use Domain\Access\Database\Seeders\OwnerSeeder;
use Domain\Plans\Database\Seeders\PlansSeeder;
use Domain\Tasks\Database\Seeders\PlanTasksSeeder;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(NumbersSeeder::class);
        $this->call(DesksSeeder::class);
        $this->call(OwnerSeeder::class);
        $tasks = $this->container->make(PlanTasksSeeder::class);
        $this->callWith(PlansSeeder::class, [
            'readingTaskIds' => $tasks->readingTaskIds(),
            'startingTaskIds' => $tasks->startingTaskIds(),
            'reproducingTaskIds' => $tasks->reproducingTaskIds(),
        ]);
    }
}
