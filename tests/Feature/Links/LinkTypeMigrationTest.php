<?php

declare(strict_types=1);

namespace Tests\Feature\Links;

use App\Links\Exceptions\UnknownLinkType;
use App\Links\Support\LinkTypeRenames;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Stored class names become link names, each link stays, and a type nobody registered stops Core's migration.
 */
final class LinkTypeMigrationTest extends TestCase
{
    use RefreshHookDatabase;

    private const array TASK_AND_PLAN = ['App\\Domain\\Tasks\\Models\\Task' => 'tasks.task', 'App\\Domain\\Plans\\Models\\Plan' => 'plans.plan'];

    public function test_class_names_become_link_names_and_ids_stay(): void
    {
        $id = $this->link('App\\Domain\\Tasks\\Models\\Task', 1, 'App\\Domain\\Plans\\Models\\Plan', 2);

        LinkTypeRenames::rename($this->app->make(ConnectionInterface::class), self::TASK_AND_PLAN);
        LinkTypeRenames::rename($this->app->make(ConnectionInterface::class), self::TASK_AND_PLAN);

        $this->assertSame(['tasks.task', 'plans.plan'], [DB::table('links')->where('id', $id)->value('source_type'), DB::table('links')->where('id', $id)->value('target_type')]);
    }

    public function test_a_link_that_already_exists_under_the_new_names_is_kept_once(): void
    {
        $this->link('tasks.task', 1, 'plans.plan', 2);
        $this->link('App\\Domain\\Tasks\\Models\\Task', 1, 'App\\Domain\\Plans\\Models\\Plan', 2);
        $other = $this->link('App\\Domain\\Tasks\\Models\\Task', 3, 'App\\Domain\\Plans\\Models\\Plan', 2);

        LinkTypeRenames::rename($this->app->make(ConnectionInterface::class), self::TASK_AND_PLAN);

        $this->assertSame(2, DB::table('links')->count());
        $this->assertSame('tasks.task', DB::table('links')->where('id', $other)->value('source_type'));
    }

    public function test_an_unknown_stored_type_stops_cores_migration(): void
    {
        $this->link('App\\Gone\\Thing', 1, 'plans.plan', 2);

        $this->expectException(UnknownLinkType::class);

        $this->coreMigration()->up();
    }

    private function link(string $sourceType, int $sourceId, string $targetType, int $targetId): int
    {
        return (int) DB::table('links')->insertGetId([
            'source_type' => $sourceType, 'source_id' => $sourceId, 'target_type' => $targetType, 'target_id' => $targetId,
            'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    private function coreMigration(): Migration
    {
        return require app_path('Links/Database/Migrations/2026_11_19_000001_alias_link_types.php');
    }
}
