<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // The environment of the connected binding a task was made through, by id alone; none for a task made here.
        Schema::table('tasks', function (Blueprint $table): void {
            $table->string('environment_id')->nullable()->index();
        });
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table): void {
            $table->dropIndex(['environment_id']);
            $table->dropColumn('environment_id');
        });
    }
};
