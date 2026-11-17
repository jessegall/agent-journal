<?php

declare(strict_types=1);

use App\Core\Links\Support\LinkTypeRenames;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * A saved command is now called a command alias: its table and its link name follow the new name. Renaming the table
 * creates command_aliases, which Processes owns from here on.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::rename('saved_commands', 'command_aliases');

        LinkTypeRenames::rename(DB::connection(), [
            'processes.saved-command' => 'processes.command-alias',
        ]);
    }
};
