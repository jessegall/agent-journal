<?php

declare(strict_types=1);

use App\Links\Support\LinkTypeRenames;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Links name Memory' models by their link names instead of their former class names.
 */
return new class extends Migration
{
    public function up(): void
    {
        LinkTypeRenames::rename(DB::connection(), [
            'App\\Domain\\Memory\\Models\\Memory' => 'memory.memory',
        ]);
    }
};
