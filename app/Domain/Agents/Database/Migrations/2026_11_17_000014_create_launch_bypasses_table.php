<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('launch_bypasses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('agent_session_id')->index();
            $table->string('native_event', 64);
            $table->string('failure', 32);
            $table->timestampTz('occurred_at');
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('launch_bypasses');
    }
};
