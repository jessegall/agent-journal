<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Tables\Plans;

use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

final class Queries
{
    private const string TABLE = 'plans';

    /**
     * @return list<Builder|string>
     */
    public function queries(string $name): array
    {
        return [
            DB::table('plans as p')->join('tasks as t', 't.id', '=', 'p.task_id'),
            DB::table('messages'),
            DB::table('users'),
            DB::table('links'),
            DB::table($name),
            DB::table(self::TABLE),
            DB::table('plans')->joinSub(DB::table('plans'), 'latest_plans', 'latest_plans.id', '=', 'plans.id'),
            DB::table('plans')->joinSub(DB::table('messages'), 'notes', 'notes.id', '=', 'plans.id'),
            DB::query()->from(fn (Builder $query) => $query->from('plans'), 'own'),
            collect(['your tasks are done'])->join(', '),
        ];
    }
}
