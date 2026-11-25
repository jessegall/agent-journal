<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Support\Reflector;
use Illuminate\Database\Eloquent\Model;
use Tests\Architecture\Support\DomainFiles;

/**
 * A model never casts created_at or updated_at: Eloquent already reads its timestamps as the project's immutable
 * dates (user message 21935).
 */
final class ModelTimestampCastsTest extends TestCase
{
    private const array TIMESTAMP_COLUMNS = ['created_at', 'updated_at'];

    public function test_no_model_casts_its_timestamps(): void
    {
        $faults = [];

        foreach ($this->models() as $class) {
            $cast = array_intersect(self::TIMESTAMP_COLUMNS, array_keys(new $class()->getCasts()));

            if ($cast !== []) {
                $faults[] = $class.' casts '.implode(' and ', $cast);
            }
        }

        $this->assertSame([], $faults, 'Remove these timestamp casts.');
    }

    /**
     * @return list<class-string<Model>>
     */
    private function models(): array
    {
        $models = [];

        foreach (DomainFiles::in([app_path(), ...DomainFiles::domainCode()]) as $file) {
            if (! str_contains($file, '/Models/')
                || preg_match('/^namespace ([^;]+);/m', (string) file_get_contents($file), $namespace) !== 1) {
                continue;
            }

            $class = $namespace[1].'\\'.basename($file, '.php');

            if (Reflector::factory()->isSubclassOf($class, Model::class)
                && Reflector::of($class)->not()->isAbstract()) {
                $models[] = $class;
            }
        }

        return $models;
    }
}
