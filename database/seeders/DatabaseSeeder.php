<?php

declare(strict_types=1);

namespace Database\Seeders;

use Domain\Access\Database\Seeders\OwnerSeeder;
use Domain\Documents\Database\Seeders\DocumentsSeeder;
use Domain\Plans\Database\Seeders\PlansSeeder;
use Domain\Sequences\Database\Seeders\SequencesSeeder;
use Domain\Tasks\Database\Seeders\PlanTasksSeeder;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seeds the local app: the owner, and sample tasks, plans, a document and a sequence. Every seeder skips what it
     * already made, so seeding again adds nothing.
     */
    public function run(): void
    {
        $this->call(NumbersSeeder::class);
        $this->call(InboxesSeeder::class);
        $this->call(OwnerSeeder::class);
        $tasks = $this->container->make(PlanTasksSeeder::class);
        $this->callWith(PlansSeeder::class, [
            'readingTaskIds' => $tasks->readingTaskIds(),
            'startingTaskIds' => $tasks->startingTaskIds(),
            'reproducingTaskIds' => $tasks->reproducingTaskIds(),
        ]);
        $this->callWith(DocumentsSeeder::class, ['author' => $this->container->make(OwnerSeeder::class)->owner()]);
        $this->call(SequencesSeeder::class);
    }
}
