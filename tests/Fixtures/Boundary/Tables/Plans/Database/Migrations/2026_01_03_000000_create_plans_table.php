<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained();
        });

        Schema::create('plan_task', function (Blueprint $table) {
            $table->foreign('task_id')->references('id')->on('tasks');
        });

        Schema::create('notes', function (Blueprint $table) {
            $table->id();
        });

        Schema::table('tasks', function (Blueprint $table) {
            $table->string('plan_name');
        });
    }
};
