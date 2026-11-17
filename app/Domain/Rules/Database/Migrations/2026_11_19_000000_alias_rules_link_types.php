<?php

declare(strict_types=1);

use App\Core\Links\Support\LinkTypeRenames;
use Illuminate\Database\Migrations\Migration;

/**
 * Links name Rules' models by their link names instead of their former class names.
 */
return new class extends Migration
{
    public function up(): void
    {
        LinkTypeRenames::rename([
            'App\\Domain\\Rules\\Models\\Rule' => 'rules.rule',
        ]);
    }
};
