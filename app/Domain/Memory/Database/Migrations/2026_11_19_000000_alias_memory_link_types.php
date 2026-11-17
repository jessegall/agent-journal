<?php

declare(strict_types=1);

use App\Core\Links\LinkTypeRenames;
use Illuminate\Database\Migrations\Migration;

/**
 * Links name Memory' models by their link names instead of their former class names.
 */
return new class extends Migration
{
    public function up(): void
    {
        LinkTypeRenames::rename([
            'App\\Domain\\Memory\\Models\\Memory' => 'memory.memory',
        ]);
    }
};
