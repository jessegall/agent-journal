<?php

declare(strict_types=1);

use App\Core\Links\Support\LinkTypeRenames;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Links name Chat' models by their link names instead of their former class names.
 */
return new class extends Migration
{
    public function up(): void
    {
        LinkTypeRenames::rename(DB::connection(), [
            'App\\Domain\\Chat\\Models\\Message' => 'chat.message',
        ]);
    }
};
