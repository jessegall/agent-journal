<?php

declare(strict_types=1);

namespace App\Numbers\Database\Seeders;

use App\Support\OutsideCommandAllowance;
use Illuminate\Database\Seeder;

/**
 * Lets the seeders that run after it create numbered records outside a bus command, as seeding has no request.
 */
final class NumbersSeeder extends Seeder
{
    public function run(OutsideCommandAllowance $outsideCommands): void
    {
        $outsideCommands->allow();
    }
}
