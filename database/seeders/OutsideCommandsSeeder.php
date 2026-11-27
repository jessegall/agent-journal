<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Bus\OutsideCommandAllowance;
use Illuminate\Database\Seeder;

/**
 * Lets the seeders that follow write their rows outside a bus command, as seeding has no request.
 */
final class OutsideCommandsSeeder extends Seeder
{
    public function run(OutsideCommandAllowance $outsideCommands): void
    {
        $outsideCommands->allow();
    }
}
