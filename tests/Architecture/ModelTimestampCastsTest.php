<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Illuminate\Database\Eloquent\Model;
use Tests\Architecture\Support\ProjectModels;

/**
 * A model never casts created_at or updated_at: Eloquent already reads its timestamps as the project's immutable
 * dates.
 */
final class ModelTimestampCastsTest extends TestCase
{
    private const array TIMESTAMP_COLUMNS = ['created_at', 'updated_at'];

    public function test_no_model_casts_its_timestamps(): void
    {
        $faults = [];

        foreach (ProjectModels::all() as $class) {
            $cast = array_intersect(self::TIMESTAMP_COLUMNS, array_keys(new $class()->getCasts()));

            if ($cast !== []) {
                $faults[] = $class.' casts '.implode(' and ', $cast);
            }
        }

        $this->assertSame([], $faults, 'Remove these timestamp casts.');
    }
}
