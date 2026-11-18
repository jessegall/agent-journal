<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Each recorded hook answer names its answer type under type instead of kind (rule 22); every call keeps its answer.
 */
return new class extends Migration
{
    public function up(): void
    {
        $this->renameAnswerKey('kind', 'type');
    }

    public function down(): void
    {
        $this->renameAnswerKey('type', 'kind');
    }

    private function renameAnswerKey(string $from, string $to): void
    {
        DB::table('hook_calls')->whereNotNull('answer')->orderBy('id')->each(function (object $call) use ($from, $to): void {
            $answer = json_decode($call->answer, true, flags: JSON_THROW_ON_ERROR);

            if (! array_key_exists($from, $answer)) {
                return;
            }

            $answer[$to] = $answer[$from];
            unset($answer[$from]);
            DB::table('hook_calls')->where('id', $call->id)->update(['answer' => json_encode($answer, JSON_THROW_ON_ERROR)]);
        });
    }
};
