<?php

declare(strict_types=1);

use App\Core\Links\LinkTypeRenames;
use Illuminate\Database\Migrations\Migration;

/**
 * Links name Plans' models by their link names instead of their former class names.
 */
return new class extends Migration
{
    public function up(): void
    {
        LinkTypeRenames::rename([
            'App\\Domain\\Plans\\Models\\Plan' => 'plans.plan',
            'App\\Domain\\Plans\\Models\\Phase' => 'plans.phase',
        ]);
    }
};
